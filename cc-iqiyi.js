/**
 * cc 爱奇艺独立播放资源
 */
var WidgetMetadata = {
  id: "cc.playback.iqiyi",
  title: "爱奇艺",
  version: "1.0.1",
  requiredVersion: "0.0.6",
  description: "爱奇艺 CMS 独立播放资源",
  author: "cc",
  modules: [
    {
      id: "loadResource",
      title: "爱奇艺",
      functionName: "loadResource",
      type: "stream",
      params: [],
    },
  ],
};

var IQIYI_ENDPOINTS = [
  "https://iqiyizyapi.com/api.php/provide/vod",
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
  if (!value || typeof value !== "object") throw new Error("爱奇艺接口响应无效");
  return value;
}

async function requestCms(query) {
  var lastError;
  for (var i = 0; i < IQIYI_ENDPOINTS.length; i++) {
    try {
      var response = await Widget.http.request({
        url: appendQuery(IQIYI_ENDPOINTS[i], query),
        method: "GET",
        headers: { Accept: "application/json" },
        timeout: 10,
      });
      return responseData(response);
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError instanceof Error ? lastError : new Error("爱奇艺接口不可用");
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
    title: text(context.title || (params && params.title)),
    releaseYear: text(
      context.releaseYear ||
      (params && (params.year || params.releaseDate))
    ).substring(0, 4),
    episode: context.episode !== undefined
      ? Number(context.episode)
      : Math.max(0, Number((params && params.episode) || 1) - 1),
  };
}

function normalizedTitle(value) {
  return text(value).toLowerCase().replace(/[\s.,，。!！?？:：·\-_'"]/g, "");
}

async function findVod(title, releaseYear) {
  var data = await requestCms({ ac: "videolist", wd: title, pg: 1 });
  var list = Array.isArray(data.list) ? data.list : [];
  var expected = normalizedTitle(title);
  var exact = list.filter(function (item) {
    return normalizedTitle(item.vod_name) === expected;
  });
  if (releaseYear) {
    var sameYear = exact.filter(function (item) {
      return text(item.vod_year).substring(0, 4) === releaseYear;
    });
    if (sameYear.length) exact = sameYear;
  }
  return exact[0] || null;
}

function parseGroups(vod) {
  var names = text(vod.vod_play_from).split("$$$");
  return text(vod.vod_play_url).split("$$$").map(function (group, index) {
    return {
      name: text(names[index]),
      episodes: group.split("#").map(function (entry) {
        var separator = entry.indexOf("$");
        return separator >= 0 ? text(entry.substring(separator + 1)) : text(entry);
      }).filter(function (url) {
        return /^https?:\/\//i.test(url);
      }),
    };
  }).filter(function (group) {
    return group.episodes.length > 0;
  });
}

async function loadResource(params) {
  var context = decodeContext(params);
  if (!context.title) throw new Error("缺少影片标题");
  var vod = await findVod(context.title, context.releaseYear);
  if (!vod || vod.vod_id === undefined) throw new Error("爱奇艺未找到标题完全一致的影片");
  var detail = await requestCms({ ac: "videolist", ids: vod.vod_id });
  var fullVod = Array.isArray(detail.list) && detail.list[0];
  if (!fullVod) throw new Error("爱奇艺详情不可用");
  var groups = parseGroups(fullVod);
  var selected = groups.find(function (group) {
    var url = group.episodes[context.episode];
    return url && /\.m3u8(?:$|\?)/i.test(url);
  }) || groups.find(function (group) {
    return Boolean(group.episodes[context.episode]);
  });
  var url = selected && selected.episodes[context.episode];
  if (!url) throw new Error("爱奇艺没有该分集");
  return [{
    name: "爱奇艺",
    description: "设备直连",
    url: url,
    playerType: "app",
  }];
}
