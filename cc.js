/**
 * LibreTV Rex - 纯客户端版
 *
 * 模块直接请求用户配置的 Apple CMS API，不需要部署 LibreTV 后端。
 * 默认配置包含 10 个 Apple CMS JSON/m3u8 片源，可在模块参数中覆盖。
 */
function catalogParams() {
  return [
    {
      name: "category",
      title: "分类",
      type: "enumeration",
      value: "all",
      enumOptions: [
        { title: "全部", value: "all" },
        { title: "电影", value: "movie" },
        { title: "电视剧", value: "tv" },
        { title: "综艺", value: "variety" },
        { title: "动漫", value: "anime" },
        { title: "纪录片", value: "documentary" },
      ],
    },
    {
      name: "genre",
      title: "类型",
      type: "enumeration",
      value: "all",
      enumOptions: [
        { title: "全部", value: "all" },
        { title: "动作", value: "动作" },
        { title: "喜剧", value: "喜剧" },
        { title: "爱情", value: "爱情" },
        { title: "科幻", value: "科幻" },
        { title: "悬疑", value: "悬疑" },
        { title: "犯罪", value: "犯罪" },
        { title: "古装", value: "古装" },
        { title: "家庭", value: "家庭" },
      ],
    },
    {
      name: "year",
      title: "年份",
      type: "enumeration",
      value: "all",
      enumOptions: [
        { title: "全部", value: "all" },
        { title: "2026", value: "2026" },
        { title: "2025", value: "2025" },
        { title: "2024", value: "2024" },
        { title: "2023", value: "2023" },
        { title: "2022", value: "2022" },
        { title: "2021", value: "2021" },
        { title: "2020", value: "2020" },
        { title: "更早", value: "older" },
      ],
    },
    { name: "page", title: "页码", type: "page", startPage: 1 },
    { name: "count", title: "数量", type: "count", value: "60" },
  ];
}

var WidgetMetadata = {
  id: "cc.catalog",
  title: "cc",
  version: "3.0.2",
  requiredVersion: "0.0.6",
  description: "影视目录、平台分类、搜索与详情",
  author: "LibreTV Rex Contributors",
  site: "https://github.com/LibreSpark/LibreTV",
  globalParams: [
    {
      name: "sources",
      title: "Apple CMS 片源",
      type: "input",
      description: "JSON 数组；留空时使用默认片源",
      value: '[{"name":"爱奇艺","url":"https://iqiyizyapi.com/api.php/provide/vod"},{"name":"芒果TV","url":"https://caiji.mgzyapi.com/api.php/provide/vod","mirrors":["https://mgzy1.tv/api.php/provide/vod","https://mgzy2.tv/api.php/provide/vod","https://mgzy3.tv/api.php/provide/vod","https://mgzy4.tv/api.php/provide/vod","https://mgzy5.tv/api.php/provide/vod"]},{"name":"红牛资源","url":"https://hongniuzy2.com/api.php/provide/vod/from/hnm3u8"},{"name":"量子资源","url":"https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8"},{"name":"优质资源库","url":"https://api.1080zyku.com/inc/api.php/provide/vod"},{"name":"卧龙资源","url":"https://collect.wolongzyw.com/api.php/provide/vod"},{"name":"闪电资源","url":"https://sdzyapi.com/api.php/provide/vod/from/sdm3u8"},{"name":"金鹰资源","url":"https://jyzyapi.com/provide/vod/from/jinyingm3u8"},{"name":"光速资源","url":"https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8"},{"name":"樱花资源","url":"https://m3u8.apiyhzy.com/api.php/provide/vod"},{"name":"U酷资源","url":"https://api.ukuapi.com/api.php/provide/vod"},{"name":"奥斯卡资源","url":"https://aosikazy.com/api.php/provide/vod"}]',
    },
  ],
  modules: [
    {
      id: "discover",
      title: "影视分类",
      functionName: "loadDiscover",
      params: catalogParams(),
    },
    {
      id: "tencent",
      title: "腾讯视频（TMDB）",
      functionName: "loadTencent",
      params: catalogParams(),
    },
    {
      id: "iqiyi",
      title: "爱奇艺（TMDB）",
      functionName: "loadIqiyi",
      params: catalogParams(),
    },
  ],
  search: {
    title: "搜索 cc",
    functionName: "search",
    params: [
      { name: "page", title: "页码", type: "page", startPage: 1 },
      { name: "count", title: "数量", type: "count", value: "30" },
    ],
  },
};

var SOURCES_STORAGE_KEY = "libretv.rex.sources.v7";
var DEFAULT_SOURCES = [
  {
    name: "爱奇艺",
    url: "https://iqiyizyapi.com/api.php/provide/vod",
  },
  {
    name: "芒果TV",
    url: "https://caiji.mgzyapi.com/api.php/provide/vod",
    mirrors: [
      "https://mgzy1.tv/api.php/provide/vod",
      "https://mgzy2.tv/api.php/provide/vod",
      "https://mgzy3.tv/api.php/provide/vod",
      "https://mgzy4.tv/api.php/provide/vod",
      "https://mgzy5.tv/api.php/provide/vod",
    ],
  },
  {
    name: "红牛资源",
    url: "https://hongniuzy2.com/api.php/provide/vod/from/hnm3u8",
  },
  {
    name: "量子资源",
    url: "https://cj.lziapi.com/api.php/provide/vod/from/lzm3u8",
  },
  {
    name: "优质资源库",
    url: "https://api.1080zyku.com/inc/api.php/provide/vod",
  },
  {
    name: "卧龙资源",
    url: "https://collect.wolongzyw.com/api.php/provide/vod",
  },
  {
    name: "闪电资源",
    url: "https://sdzyapi.com/api.php/provide/vod/from/sdm3u8",
  },
  {
    name: "金鹰资源",
    url: "https://jyzyapi.com/provide/vod/from/jinyingm3u8",
  },
  {
    name: "光速资源",
    url: "https://api.guangsuapi.com/api.php/provide/vod/from/gsm3u8",
  },
  {
    name: "樱花资源",
    url: "https://m3u8.apiyhzy.com/api.php/provide/vod",
  },
  {
    name: "U酷资源",
    url: "https://api.ukuapi.com/api.php/provide/vod",
  },
  {
    name: "奥斯卡资源",
    url: "https://aosikazy.com/api.php/provide/vod",
  },
];
var REQUEST_TIMEOUT_SECONDS = 15;
var ADULT_WORDS = [
  "伦理", "福利", "无码", "有码", "色情", "自拍偷拍", "里番",
  "萝莉", "制服诱惑", "黑丝诱惑", "国产传媒", "SWAG", "91视频",
];

function asText(value) {
  return value === null || value === undefined ? "" : String(value).trim();
}

function sourceKey(source, index) {
  return asText(source.key) || "source-" + String(index + 1);
}

function normalizeSources(value) {
  var parsed = value;
  if (typeof parsed === "string") {
    if (!parsed.trim()) return [];
    try {
      parsed = JSON.parse(parsed);
    } catch (error) {
      throw new Error("片源配置不是有效的 JSON 数组");
    }
  }
  if (!Array.isArray(parsed)) throw new Error("片源配置必须是 JSON 数组");

  return parsed.map(function (item, index) {
    var source = item || {};
    var url = asText(source.url).replace(/\/+$/, "");
    if (!/^https?:\/\//i.test(url)) {
      throw new Error("第 " + String(index + 1) + " 个片源 URL 无效");
    }
    return {
      key: sourceKey(source, index),
      name: asText(source.name) || "片源 " + String(index + 1),
      url: url,
      mirrors: (Array.isArray(source.mirrors) ? source.mirrors : [])
        .map(function (mirror) { return asText(mirror).replace(/\/+$/, ""); })
        .filter(function (mirror) { return /^https?:\/\//i.test(mirror) && mirror !== url; }),
    };
  });
}

async function readSources(params) {
  if (params && params.sources !== undefined && asText(params.sources)) {
    var configured = normalizeSources(params.sources);
    if (Widget.storage && typeof Widget.storage.set === "function") {
      await Widget.storage.set(SOURCES_STORAGE_KEY, configured);
    }
    return configured;
  }
  if (Widget.storage && typeof Widget.storage.get === "function") {
    var saved = await Widget.storage.get(SOURCES_STORAGE_KEY);
    if (saved) {
      var sources = normalizeSources(saved);
      if (sources.length) return sources;
    }
  }
  return normalizeSources(DEFAULT_SOURCES);
}

function appendQuery(url, values) {
  var parts = [];
  Object.keys(values).forEach(function (key) {
    if (values[key] !== undefined && values[key] !== null && values[key] !== "") {
      parts.push(encodeURIComponent(key) + "=" + encodeURIComponent(String(values[key])));
    }
  });
  if (!parts.length) return url;
  return url + (url.indexOf("?") >= 0 ? "&" : "?") + parts.join("&");
}

function responseData(response) {
  var value = response && response.data !== undefined ? response.data : response;
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (error) {
      throw new Error("片源返回了无效 JSON");
    }
  }
  if (!value || typeof value !== "object") throw new Error("片源响应格式无效");
  return value;
}

async function requestCmsAt(endpoint, query) {
  var response = await Widget.http.request({
    url: appendQuery(endpoint, query),
    method: "GET",
    headers: { Accept: "application/json" },
    timeout: REQUEST_TIMEOUT_SECONDS,
  });
  return responseData(response);
}

async function requestCms(source, query) {
  var endpoints = [source.url].concat(source.mirrors || []);
  var lastError;
  for (var i = 0; i < endpoints.length; i++) {
    try {
      return {
        data: await requestCmsAt(endpoints[i], query),
        endpoint: endpoints[i],
      };
    } catch (error) {
      lastError = error;
      if (i < endpoints.length - 1) {
        console.warn(source.name + "主接口失败，尝试备用接口 " + String(i + 1));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error(source.name + "请求失败");
}

function resolveUrl(value, base) {
  var url = asText(value);
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.indexOf("//") === 0) return "https:" + url;
  try {
    return new URL(url, base).toString();
  } catch (error) {
    return url;
  }
}

function isAdult(item) {
  var text = [item.type_name, item.vod_class, item.vod_name].map(asText).join(" ");
  return ADULT_WORDS.some(function (word) { return text.indexOf(word) >= 0; });
}

function itemToSearchResult(item, source, endpoint) {
  return {
    sourceKey: source.key,
    sourceName: source.name,
    vodId: asText(item.vod_id),
    endpoint: endpoint,
    title: asText(item.vod_name) || "未命名影片",
    cover: resolveUrl(item.vod_pic, endpoint),
    typeName: asText(item.type_name || item.vod_class),
    year: asText(item.vod_year),
    area: asText(item.vod_area),
    remarks: asText(item.vod_remarks),
    className: asText(item.vod_class),
    platformText: [
      item.vod_tag,
      item.vod_class,
      item.vod_remarks,
      item.vod_blurb,
      item.vod_play_from,
    ].map(asText).join(" "),
  };
}

function encodeLink(reference) {
  return "libretv:" + encodeURIComponent(JSON.stringify(reference));
}

function decodeLink(link) {
  var raw = asText(link);
  if (raw.indexOf("libretv:") !== 0) throw new Error("无法识别的 LibreTV 链接");
  try {
    return JSON.parse(decodeURIComponent(raw.substring("libretv:".length)));
  } catch (error) {
    throw new Error("LibreTV 链接格式错误");
  }
}

function inferMediaType(item) {
  return /剧|综艺|动漫|动画|番/.test(asText(item && item.typeName)) ? "tv" : "movie";
}

function resultToVideo(item) {
  var reference = {
    sourceKey: item.sourceKey,
    vodId: String(item.vodId),
    endpoint: item.endpoint,
    title: item.title,
    releaseYear: item.year,
  };
  return {
    id: item.sourceKey + ":" + item.vodId,
    type: "url",
    title: item.title,
    subtitle: [item.year, item.area, item.remarks, item.sourceName].filter(Boolean).join(" · "),
    posterPath: item.cover,
    coverUrl: item.cover,
    mediaType: inferMediaType(item),
    link: encodeLink(reference),
  };
}

async function listSource(source, keyword, page) {
  var response = await requestCms(source, {
    ac: "videolist",
    wd: keyword || undefined,
    pg: page || 1,
  });
  var data = response.data;
  var list = Array.isArray(data.list) ? data.list : [];
  return list.filter(function (item) {
    return item && item.vod_id !== undefined && !isAdult(item);
  }).map(function (item) {
    return itemToSearchResult(item, source, response.endpoint);
  });
}

async function aggregateSources(sources, keyword, page) {
  var outcomes = await Promise.all(sources.map(async function (source) {
    try {
      return { source: source, items: await listSource(source, keyword, page) };
    } catch (error) {
      var message = error instanceof Error ? error.message : String(error);
      console.warn(source.name + "请求失败：" + message);
      return { source: source, items: [], error: message };
    }
  }));
  var failures = outcomes.filter(function (outcome) { return outcome.error; });
  if (failures.length === outcomes.length) {
    throw new Error("所有片源均请求失败，请在“请求与日志”中查看状态码");
  }
  var seen = {};
  var items = [];
  outcomes.forEach(function (outcome) {
    outcome.items.forEach(function (item) {
      var key = item.sourceKey + ":" + item.vodId;
      if (!seen[key]) {
        seen[key] = true;
        items.push(item);
      }
    });
  });
  return items;
}

var CATEGORY_PATTERNS = {
  movie: /电影|动作片|喜剧片|爱情片|科幻片|恐怖片|剧情片|战争片/,
  tv: /电视剧|国产剧|港台剧|香港剧|台湾剧|欧美剧|日韩剧|日本剧|韩国剧|泰国剧|连续剧/,
  variety: /综艺|真人秀|脱口秀/,
  anime: /动漫|动画|番剧/,
  documentary: /纪录片|纪录/,
};

function matchesCatalog(item, params) {
  var category = asText(params && params.category) || "all";
  var genre = asText(params && params.genre) || "all";
  var year = asText(params && params.year) || "all";
  var classification = [item.typeName, item.className, item.title].filter(Boolean).join(" ");

  if (category !== "all") {
    var categoryPattern = CATEGORY_PATTERNS[category];
    if (categoryPattern && !categoryPattern.test(classification)) return false;
  }
  if (genre !== "all" && classification.indexOf(genre) < 0) return false;
  if (year !== "all") {
    var itemYear = Number.parseInt(asText(item.year), 10);
    if (year === "older") {
      if (!Number.isFinite(itemYear) || itemYear >= 2020) return false;
    } else if (asText(item.year) !== year) {
      return false;
    }
  }
  return true;
}

async function loadCatalog(params) {
  var sources = await readSources(params);
  var page = Math.max(1, Number((params && params.page) || 1));
  var count = Math.max(1, Number((params && params.count) || 60));
  var items = await aggregateSources(sources, "", page);
  return items.filter(function (item) {
    return matchesCatalog(item, params);
  }).slice(0, count).map(resultToVideo);
}

var TMDB_PROVIDER_IDS = {
  tencent: "623",
  iqiyi: "581",
};

var TMDB_GENRES = {
  movie: {
    "动作": "28", "喜剧": "35", "爱情": "10749", "科幻": "878",
    "悬疑": "9648", "犯罪": "80", "古装": "36", "家庭": "10751",
  },
  tv: {
    "动作": "10759", "喜剧": "35", "爱情": "18", "科幻": "10765",
    "悬疑": "9648", "犯罪": "80", "古装": "10768", "家庭": "10751",
  },
};

function tmdbTargets(category) {
  if (category === "movie") return [{ mediaType: "movie" }];
  if (category === "tv") return [{ mediaType: "tv" }];
  if (category === "variety") return [{ mediaType: "tv", genre: "10764|10767" }];
  if (category === "anime") return [{ mediaType: "tv", genre: "16" }];
  if (category === "documentary") return [{ mediaType: "movie", genre: "99" }];
  return [{ mediaType: "movie" }, { mediaType: "tv" }];
}

function tmdbDiscoverParams(params, providerId, target) {
  var page = Math.max(1, Number((params && params.page) || 1));
  var year = asText(params && params.year) || "all";
  var genre = asText(params && params.genre) || "all";
  var values = {
    language: "zh-CN",
    page: page,
    sort_by: "popularity.desc",
    watch_region: "HK",
    with_watch_providers: providerId,
  };
  var genres = [];
  if (target.genre) genres.push(target.genre);
  if (genre !== "all" && TMDB_GENRES[target.mediaType][genre]) {
    genres.push(TMDB_GENRES[target.mediaType][genre]);
  }
  if (genres.length) values.with_genres = genres.join(",");
  if (year !== "all") {
    if (year === "older") {
      values[target.mediaType === "movie" ? "primary_release_date.lte" : "first_air_date.lte"] =
        "2019-12-31";
    } else {
      values[target.mediaType === "movie" ? "primary_release_year" : "first_air_date_year"] = year;
    }
  }
  return values;
}

function tmdbItem(item, mediaType, providerName) {
  var title = asText(mediaType === "movie" ? item.title : item.name);
  var date = asText(mediaType === "movie" ? item.release_date : item.first_air_date);
  var cover = item.poster_path
    ? "https://image.tmdb.org/t/p/w500" + item.poster_path
    : "";
  return {
    id: "platform:" + providerName + ":" + mediaType + ":" + item.id,
    type: "url",
    mediaType: mediaType,
    title: title,
    subtitle: [date ? date.substring(0, 4) : "", providerName].filter(Boolean).join(" · "),
    posterPath: cover,
    coverUrl: cover,
    releaseDate: date,
    rating: item.vote_average,
    description: asText(item.overview),
    link: encodeLink({
      catalog: true,
      title: title,
      mediaType: mediaType,
      tmdbId: String(item.id),
      providerName: providerName,
      releaseYear: date ? date.substring(0, 4) : "",
    }),
  };
}

async function loadTmdbProvider(params, providerKey, providerName) {
  await readSources(params);
  var providerId = TMDB_PROVIDER_IDS[providerKey];
  var targets = tmdbTargets(asText(params && params.category) || "all");
  var pages = await Promise.all(targets.map(async function (target) {
    var body = await Widget.tmdb.get("discover/" + target.mediaType, {
      params: tmdbDiscoverParams(params, providerId, target),
    });
    return (body.results || []).map(function (item) {
      return tmdbItem(item, target.mediaType, providerName);
    });
  }));
  var count = Math.max(1, Number((params && params.count) || 60));
  var seen = {};
  return pages.reduce(function (all, list) {
    list.forEach(function (item) {
      var key = item.mediaType + ":" + item.id;
      if (!seen[key]) {
        seen[key] = true;
        all.push(item);
      }
    });
    return all;
  }, []).slice(0, count);
}

async function loadDiscover(params) {
  return loadCatalog(params);
}

async function loadTencent(params) {
  return loadTmdbProvider(params, "tencent", "腾讯视频");
}

async function loadIqiyi(params) {
  return loadTmdbProvider(params, "iqiyi", "爱奇艺");
}

async function search(params) {
  var sources = await readSources(params);
  var keyword = asText(params && params.keyword);
  if (!keyword) return [];
  var page = Math.max(1, Number((params && params.page) || 1));
  var count = Math.max(1, Number((params && params.count) || 30));
  var items = await aggregateSources(sources, keyword, page);
  return items.slice(0, count).map(resultToVideo);
}

function findSource(sources, key) {
  for (var i = 0; i < sources.length; i++) {
    if (sources[i].key === key) return sources[i];
  }
  throw new Error("找不到对应片源，请检查片源配置是否已更改");
}

function parseEpisodeEntry(entry, source) {
  var text = asText(entry);
  if (!text) return null;
  var separator = text.indexOf("$");
  var title = separator >= 0 ? asText(text.substring(0, separator)) : "";
  var url = separator >= 0 ? asText(text.substring(separator + 1)) : text;
  if (!url) return null;
  return {
    title: title,
    url: resolveUrl(url, source.url),
  };
}

function parsePlayGroups(vod, source) {
  var playUrl = asText(vod.vod_play_url);
  var fromNames = asText(vod.vod_play_from).split("$$$");
  var groups = playUrl.split("$$$").map(function (group, groupIndex) {
    var episodes = group.split("#").map(function (entry) {
      return parseEpisodeEntry(entry, source);
    }).filter(Boolean);
    return {
      name: asText(fromNames[groupIndex]) || source.name + " 线路 " + String(groupIndex + 1),
      episodes: episodes,
    };
  }).filter(function (group) {
    return group.episodes.length > 0;
  });

  if (!groups.length) {
    var content = asText(vod.vod_content);
    var matches = content.match(/https?:\/\/[^"'\s<>]+?\.m3u8(?:\?[^"'\s<>]*)?/gi) || [];
    if (matches.length) {
      groups.push({
        name: source.name,
        episodes: matches.map(function (url, index) {
          return { title: "第 " + String(index + 1) + " 集", url: url };
        }),
      });
    }
  }
  return groups;
}

async function fetchDetail(source, vodId, endpoint, expectedTitle, expectedYear) {
  var targetEndpoint = asText(endpoint) || source.url;
  var data = await requestCmsAt(targetEndpoint, { ac: "videolist", ids: vodId });
  if (!Array.isArray(data.list) || !data.list.length) throw new Error("片源没有返回详情");
  var vod = data.list[0] || {};
  if (expectedTitle && normalizedTitle(vod.vod_name) !== normalizedTitle(expectedTitle)) {
    throw new Error("片源详情与搜索结果标题不一致");
  }
  var actualYear = asText(vod.vod_year).substring(0, 4);
  var wantedYear = asText(expectedYear).substring(0, 4);
  if (wantedYear && actualYear && wantedYear !== actualYear) {
    throw new Error("片源详情与搜索结果年份不一致");
  }
  var requestSource = { name: source.name, url: targetEndpoint };
  var groups = parsePlayGroups(vod, requestSource);
  if (!groups.length) throw new Error("未找到可播放地址");
  return { vod: vod, groups: groups, endpoint: targetEndpoint };
}

function cleanDescription(value) {
  return asText(value)
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizedTitle(value) {
  return asText(value).toLowerCase().replace(/[\s.,，。!！?？:：·\-_'"]/g, "");
}

function normalizedEpisodeTitle(value) {
  return asText(value).toLowerCase().replace(/[\s.,，。!！?？:：·\-_'"]/g, "");
}

function episodeNumber(value) {
  var label = asText(value);
  var match = label.match(/第\s*0*(\d+)\s*[集期话]/i) ||
    label.match(/(?:^|[^a-z])ep?\s*0*(\d+)(?:[^0-9]|$)/i) ||
    label.match(/^0*(\d+)$/);
  return match ? Number(match[1]) : null;
}

function selectEpisode(group, episodeIndex, episodeName) {
  var episodes = group && Array.isArray(group.episodes) ? group.episodes : [];
  var expectedLabel = normalizedEpisodeTitle(episodeName);
  if (expectedLabel) {
    var exact = episodes.find(function (episode) {
      return normalizedEpisodeTitle(episode.title) === expectedLabel;
    });
    if (exact) return exact;
  }
  var expectedNumber = episodeNumber(episodeName);
  if (expectedNumber === null && Number.isFinite(episodeIndex)) {
    expectedNumber = episodeIndex + 1;
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
  if (episodes.length === 1 && episodeIndex === 0) return episodes[0];
  return expectedLabel ? null : episodes[episodeIndex] || null;
}

async function fetchCatalogDetails(sources, title, releaseYear) {
  var items = await aggregateSources(sources, title, 1);
  if (!items.length) return [];
  var expected = normalizedTitle(title);
  var exactItems = items.filter(function (item) {
    return normalizedTitle(item.title) === expected;
  });
  if (!exactItems.length) return [];
  var expectedYear = asText(releaseYear).substring(0, 4);
  if (expectedYear) {
    var yearItems = exactItems.filter(function (item) {
      return asText(item.year).substring(0, 4) === expectedYear;
    });
    var unknownYearItems = exactItems.filter(function (item) {
      return !asText(item.year).substring(0, 4);
    });
    exactItems = yearItems.length ? yearItems : unknownYearItems;
  }
  var candidates = exactItems;
  var seenSources = {};
  candidates = candidates.filter(function (item) {
    if (seenSources[item.sourceKey]) return false;
    seenSources[item.sourceKey] = true;
    return true;
  });
  var outcomes = await Promise.all(candidates.map(async function (item) {
    try {
      var source = findSource(sources, item.sourceKey);
      return {
        source: source,
        reference: item,
        detail: await fetchDetail(source, item.vodId, item.endpoint, item.title, item.year),
      };
    } catch (error) {
      console.warn(item.sourceName + "详情获取失败：" +
        (error instanceof Error ? error.message : String(error)));
      return null;
    }
  }));
  return outcomes.filter(Boolean);
}

function catalogDetailResponse(reference, matches, tmdbDetail) {
  if (!matches.length) return [];
  var episodeCount = 0;
  matches.forEach(function (match) {
    match.detail.groups.forEach(function (group) {
      episodeCount = Math.max(episodeCount, group.episodes.length);
    });
  });
  var episodeItems = [];
  for (var index = 0; index < episodeCount; index++) {
    episodeItems.push({
      id: "catalog:" + reference.mediaType + ":" + normalizedTitle(reference.title) + ":" + index,
      type: "url",
      title: episodeCount === 1 ? "正片" : "第 " + String(index + 1) + " 集",
      mediaType: reference.mediaType,
      link: encodeLink({
        catalogPlayback: true,
        title: reference.title,
        episode: index,
        episodeName: episodeCount === 1 ? "正片" : "第 " + String(index + 1) + " 集",
        releaseYear: reference.releaseYear,
      }),
    });
  }
  var date = asText(reference.mediaType === "movie"
    ? tmdbDetail && tmdbDetail.release_date
    : tmdbDetail && tmdbDetail.first_air_date);
  var cover = tmdbDetail && tmdbDetail.poster_path
    ? "https://image.tmdb.org/t/p/w500" + tmdbDetail.poster_path
    : "";
  var backdrop = tmdbDetail && tmdbDetail.backdrop_path
    ? "https://image.tmdb.org/t/p/original" + tmdbDetail.backdrop_path
    : "";
  return {
    id: "catalog:" + reference.mediaType + ":" + normalizedTitle(reference.title),
    type: "url",
    title: reference.title,
    subtitle: [date ? date.substring(0, 4) : "", reference.providerName]
      .filter(Boolean).join(" · "),
    description: asText(tmdbDetail && tmdbDetail.overview),
    posterPath: cover,
    coverUrl: cover,
    backdropPaths: backdrop ? [backdrop] : [],
    rating: tmdbDetail && tmdbDetail.vote_average,
    releaseDate: date,
    genreItems: ((tmdbDetail && tmdbDetail.genres) || []).map(function (genre) {
      return { id: String(genre.id), title: asText(genre.name) };
    }),
    mediaType: reference.mediaType,
    episode: episodeCount || 1,
    episodeItems: episodeItems,
    link: encodeLink({
      catalog: true,
      title: reference.title,
      mediaType: reference.mediaType,
      tmdbId: reference.tmdbId,
      providerName: reference.providerName,
      releaseYear: reference.releaseYear,
    }),
  };
}

function preferredDetailSources(sources) {
  var preferred = sources.filter(function (source) {
    return source.name === "爱奇艺" || source.name === "芒果TV";
  });
  return preferred.length ? preferred : sources.slice(0, 2);
}

async function loadDetail(link) {
  var sources = await readSources();
  var reference = decodeLink(link);
  if (reference.catalog) {
    var tmdbDetail = null;
    if (reference.tmdbId) {
      try {
        tmdbDetail = await Widget.tmdb.get(
          reference.mediaType + "/" + reference.tmdbId,
          { params: { language: "zh-CN" } }
        );
      } catch (error) {
        console.warn("TMDB 详情获取失败：" +
          (error instanceof Error ? error.message : String(error)));
      }
    }
    return catalogDetailResponse(
      reference,
      await fetchCatalogDetails(
        preferredDetailSources(sources),
        reference.title,
        reference.releaseYear
      ),
      tmdbDetail
    );
  }
  var source = findSource(sources, reference.sourceKey);
  var detail = await fetchDetail(
    source,
    reference.vodId,
    reference.endpoint,
    reference.title,
    reference.releaseYear
  );
  var vod = detail.vod;
  var primary = detail.groups.find(function (group) {
    return group.episodes.some(function (episode) {
      return /\.m3u8(?:$|\?)/i.test(episode.url);
    });
  }) || detail.groups[0];
  var mediaType = inferMediaType({ typeName: vod.type_name || vod.vod_class });
  var title = asText(vod.vod_name) || reference.title || "未命名影片";
  var episodeItems = primary.episodes.map(function (episode, index) {
    return {
      id: source.key + ":" + reference.vodId + ":" + String(index),
      type: "url",
      title: episode.title || "第 " + String(index + 1) + " 集",
      mediaType: mediaType,
      link: encodeLink({
        sourceKey: source.key,
        vodId: String(reference.vodId),
        endpoint: detail.endpoint,
        title: title,
        episode: index,
        episodeName: episode.title || "第 " + String(index + 1) + " 集",
        releaseYear: asText(vod.vod_year),
      }),
    };
  });

  return {
    id: source.key + ":" + reference.vodId,
    type: "url",
    title: title,
    description: cleanDescription(vod.vod_content),
    subtitle: [vod.vod_year, vod.vod_area, vod.type_name || vod.vod_class, vod.vod_remarks]
      .map(asText).filter(Boolean).join(" · "),
    posterPath: resolveUrl(vod.vod_pic, source.url),
    coverUrl: resolveUrl(vod.vod_pic, source.url),
    mediaType: mediaType,
    episode: episodeItems.length || 1,
    episodeItems: episodeItems,
    link: encodeLink({
      sourceKey: source.key,
      vodId: String(reference.vodId),
      endpoint: detail.endpoint,
      title: title,
      releaseYear: asText(vod.vod_year),
    }),
  };
}

async function loadResource(params) {
  var sources = await readSources(params);
  var reference = decodeLink(params && params.link);
  if (reference.catalog || reference.catalogPlayback) {
    var catalogEpisode = reference.episode !== undefined
      ? Number(reference.episode)
      : Math.max(0, Number((params && params.episode) || 1) - 1);
    var catalogEpisodeName = asText(
      reference.episodeName || (params && params.episodeName)
    );
    var matches = await fetchCatalogDetails(sources, reference.title, reference.releaseYear);
    var catalogItems = [];
    var seenUrls = {};
    matches.forEach(function (match) {
      match.detail.groups.forEach(function (group) {
        var selected = selectEpisode(group, catalogEpisode, catalogEpisodeName);
        if (!selected || !/^https?:\/\//i.test(selected.url) || seenUrls[selected.url]) return;
        seenUrls[selected.url] = true;
        catalogItems.push({
          name: match.source.name +
            (match.detail.groups.length > 1 ? " · " + group.name : ""),
          description: "设备直连",
          url: selected.url,
          playerType: "app",
        });
      });
    });
    if (!catalogItems.length) throw new Error("该分集没有可播放线路");
    return catalogItems;
  }
  var source = findSource(sources, reference.sourceKey);
  var detail = await fetchDetail(
    source,
    reference.vodId,
    reference.endpoint,
    reference.title,
    reference.releaseYear
  );
  var episode = Number(
    reference.episode !== undefined
      ? reference.episode
      : Math.max(0, Number((params && params.episode) || 1) - 1)
  );
  var episodeName = asText(reference.episodeName || (params && params.episodeName));
  var items = [];
  detail.groups.forEach(function (group) {
    var selected = selectEpisode(group, episode, episodeName);
    if (selected && /^https?:\/\//i.test(selected.url)) {
      items.push({
        name: detail.groups.length > 1 ? source.name + " · " + group.name : source.name,
        description: "设备直连",
        url: selected.url,
        playerType: "app",
      });
    }
  });
  if (!items.length) throw new Error("该分集没有可播放线路");
  return items;
}
