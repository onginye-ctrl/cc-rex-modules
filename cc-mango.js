/**
 * cc 芒果TV独立播放资源
 */
var WidgetMetadata = {
  id: "cc.playback.mango",
  title: "芒果TV",
  version: "1.0.3",
  requiredVersion: "0.0.6",
  description: "芒果TV CMS 独立播放资源，支持备用接口自动切换",
  author: "cc",
  modules: [
    {
      id: "loadResource",
      title: "芒果TV",
      functionName: "loadResource",
      type: "stream",
      iconurl: "https://static.hitv.com/pc/icons/icon_64x64.1b7ca7.png",
      params: [],
    },
  ],
};

var MANGO_ENDPOINTS = [
  "https://caiji.mgzyapi.com/api.php/provide/vod",
  "https://mgzy1.tv/api.php/provide/vod",
  "https://mgzy2.tv/api.php/provide/vod",
  "https://mgzy3.tv/api.php/provide/vod",
  "https://mgzy4.tv/api.php/provide/vod",
  "https://mgzy5.tv/api.php/provide/vod",
];

function text(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function appendQuery(url, values) {
  var query = Object.keys(values).map(function (key) {
    return encodeURIComponent(key) + "=" + encodeURIComponent(String(values[key]));
  }).join("&");
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + query;
}

function responseData(response) {
  var value = response && response.data !== undefined ? response.data : response;
  if (typeof value === "string") value = JSON.parse(value);
  if (!value || typeof value !== "object") throw new Error("芒果TV接口响应无效");
  return value;
}

async function requestCmsAt(endpoint, query) {
  var response = await Widget.http.request({
    url: appendQuery(endpoint, query),
    method: "GET",
    headers: { Accept: "application/json" },
    timeout: 10,
  });
  return responseData(response);
}

function decodeContext(params) {
  var context = {};
  var link = text(params && params.link);
  if (link.indexOf("libretv:") === 0) {
    try {
      context = JSON.parse(decodeURIComponent(link.substring("libretv:".length)));
    } catch (error) {
      context = {};
    }
  }
  return {
    title: text(context.title || (params && (params.seriesName || params.title))),
    releaseYear: text(
      context.releaseYear ||
      (params && (params.year || params.releaseDate))
    ).substring(0, 4),
    episodeName: text(context.episodeName || (params && params.episodeName)),
    episode: context.episode !== undefined
      ? Number(context.episode)
      : Math.max(0, Number((params && params.episode) || 1) - 1),
  };
}

function normalizedTitle(value) {
  return text(value).toLowerCase().replace(/[\s.,，。!！?？:：·\-_'"]/g, "");
}

async function findVod(title, releaseYear) {
  var expected = normalizedTitle(title);
  for (var i = 0; i < MANGO_ENDPOINTS.length; i++) {
    try {
      var endpoint = MANGO_ENDPOINTS[i];
      var data = await requestCmsAt(endpoint, { ac: "videolist", wd: title, pg: 1 });
      var list = Array.isArray(data.list) ? data.list : [];
      var exact = list.filter(function (item) {
        return normalizedTitle(item.vod_name) === expected;
      });
      if (releaseYear) {
        var sameYear = exact.filter(function (item) {
          return text(item.vod_year).substring(0, 4) === releaseYear;
        });
        var unknownYear = exact.filter(function (item) {
          return !text(item.vod_year).substring(0, 4);
        });
        exact = sameYear.length ? sameYear : unknownYear;
      }
      var match = exact[0];
      if (!match || match.vod_id === undefined) continue;
      var detail = await requestCmsAt(endpoint, { ac: "videolist", ids: match.vod_id });
      var fullVod = Array.isArray(detail.list) && detail.list[0];
      if (!fullVod || normalizedTitle(fullVod.vod_name) !== expected) continue;
      var actualYear = text(fullVod.vod_year).substring(0, 4);
      if (releaseYear && actualYear && actualYear !== releaseYear) continue;
      return fullVod;
    } catch (error) {
      if (i < MANGO_ENDPOINTS.length - 1) {
        console.warn("芒果TV接口失败，改用下一备用地址重新搜索");
      }
    }
  }
  return null;
}

function normalizedEpisodeTitle(value) {
  return text(value).toLowerCase().replace(/[\s.,，。!！?？:：·\-_'"]/g, "");
}

function episodeNumber(value) {
  var label = text(value);
  var match = label.match(/第\s*0*(\d+)\s*[集期话]/i) ||
    label.match(/(?:^|[^a-z])ep?\s*0*(\d+)(?:[^0-9]|$)/i) ||
    label.match(/^0*(\d+)$/);
  return match ? Number(match[1]) : null;
}

function parseGroups(vod) {
  var names = text(vod.vod_play_from).split("$$$");
  return text(vod.vod_play_url).split("$$$").map(function (group, index) {
    return {
      name: text(names[index]),
      episodes: group.split("#").map(function (entry) {
        var separator = entry.indexOf("$");
        var title = separator >= 0 ? text(entry.substring(0, separator)) : "";
        var url = separator >= 0 ? text(entry.substring(separator + 1)) : text(entry);
        return { title: title, url: url };
      }).filter(function (episode) {
        return /^https?:\/\//i.test(episode.url);
      }),
    };
  }).filter(function (group) {
    return group.episodes.length > 0;
  });
}

function selectEpisode(group, context) {
  var episodes = group.episodes;
  var expectedLabel = normalizedEpisodeTitle(context.episodeName);
  if (expectedLabel) {
    var exact = episodes.find(function (episode) {
      return normalizedEpisodeTitle(episode.title) === expectedLabel;
    });
    if (exact) return exact;
  }
  var expectedNumber = episodeNumber(context.episodeName);
  if (expectedNumber === null && Number.isFinite(context.episode)) {
    expectedNumber = context.episode + 1;
  }
  if (expectedNumber !== null) {
    var numbered = episodes.filter(function (episode) {
      return episodeNumber(episode.title) !== null;
    });
    var numberedMatch = numbered.find(function (episode) {
      return episodeNumber(episode.title) === expectedNumber;
    });
    if (numberedMatch) return numberedMatch;
    if (numbered.length) return null;
  }
  if (episodes.length === 1 && context.episode === 0) return episodes[0];
  return expectedLabel ? null : episodes[context.episode] || null;
}

async function loadResource(params) {
  var context = decodeContext(params);
  if (!context.title) throw new Error("缺少影片标题");
  var fullVod = await findVod(context.title, context.releaseYear);
  if (!fullVod) throw new Error("芒果TV详情不可用");
  var groups = parseGroups(fullVod);
  var selected = groups.find(function (group) {
    var episode = selectEpisode(group, context);
    return episode && /\.m3u8(?:$|\?)/i.test(episode.url);
  }) || groups.find(function (group) {
    return Boolean(selectEpisode(group, context));
  });
  var episode = selected && selectEpisode(selected, context);
  var url = episode && episode.url;
  if (!url) throw new Error("芒果TV没有该分集");
  return [{
    name: "芒果TV",
    description: "设备直连",
    url: url,
    playerType: "app",
  }];
}
