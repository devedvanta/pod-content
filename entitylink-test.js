const request = require("./await-request");

async function entityMatch() {
  let headers = {};

  const wikiEntityLiking = await request({
    method: "get",
    url: "https://opentapioca.org/api/annotate",
    qs: {
      query: "Brad  lives in Jaka"
    },
    headers: headers,
    json: true
  });
  console.log(wikiEntityLiking);
  let qid_list = wikiEntityLiking.annotations.map(each_match => each_match.best_qid);
  quid_list = qid_list.filter(quid => !!quid)
  console.log(qid_list);
  return qid_list;
}

async function getEntityImages(QID) {
  let primaryImages = await _getEntityPrimaryImages(QID);
  let linkedImages = await _getEntitySecondaryImages(QID);
  
  console.log('primaryImages', primaryImages);
  console.log('linkedImages', linkedImages);

}

async function _getEntityPrimaryImages(QID) {
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
  };
  const SPARQL = `
    SELECT ?img
    WHERE 
    {
      wd:${QID} wdt:P18 ?image
      
      BIND(REPLACE(wikibase:decodeUri(STR(?image)), "http://commons.wikimedia.org/wiki/Special:FilePath/", "") as ?fileName) .
      BIND(REPLACE(?fileName, " ", "_") as ?safeFileName)
      BIND(MD5(?safeFileName) as ?fileNameMD5) .
      BIND(CONCAT("https://upload.wikimedia.org/wikipedia/commons/thumb/", SUBSTR(?fileNameMD5, 1, 1), "/", SUBSTR(?fileNameMD5, 1, 2), "/", ?safeFileName, "/650px-", ?safeFileName) as ?img)
  
    }
  `;
  const primaryImages = await request({
    method: "get",
    url: `https://query.wikidata.org/sparql?query=${SPARQL}`,
    headers: headers,
    json: true
  });
  // console.log('primaryImages', primaryImages);
  
  if (primaryImages && primaryImages.results && primaryImages.results.bindings) {
    console.log(primaryImages.results.bindings);
    return primaryImages.results.bindings.map((data) => {
      return { url: data.img.value };
    });
  }
  return null;
}

async function _getEntitySecondaryImages(QID) {
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
  };
  const SPARQL = `
  SELECT ?itemLevel2Label ?prop ?imgLvl2
  WHERE 
  {
    wd:${QID} ?prop ?itemLevel2.
    ?itemLevel2 wdt:P18 ?image.
    BIND(REPLACE(wikibase:decodeUri(STR(?image)), "http://commons.wikimedia.org/wiki/Special:FilePath/", "") as ?fileName) .
    BIND(REPLACE(?fileName, " ", "_") as ?safeFileName)
    BIND(MD5(?safeFileName) as ?fileNameMD5) .
    BIND(CONCAT("https://upload.wikimedia.org/wikipedia/commons/thumb/", SUBSTR(?fileNameMD5, 1, 1), "/", SUBSTR(?fileNameMD5, 1, 2), "/", ?safeFileName, "/650px-", ?safeFileName) as ?imgLvl2)
  
    SERVICE wikibase:label { bd:serviceParam wikibase:language "[AUTO_LANGUAGE],en". }
  }
  `;
  const secondaryImages = await request({
    method: "get",
    url: `https://query.wikidata.org/sparql?query=${SPARQL}`,
    headers: headers,
    json: true
  });
  console.log('secondaryImages', secondaryImages);
  return secondaryImages.results.bindings.map((data) => {
    return {
      url: data.imgLvl2.value,
      prop: data.prop,
      value: data.itemLevel2Label.value
    }
  });
   
}

entityMatch();
getEntityImages('Q9570');
