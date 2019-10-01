async function entityMatch(
  query = "John Trivolta's performace in Pulp fiction was jazzy"
) {
  let headers = {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36"
  };
  console.log("init");
  console.log(query);
  if (!query || query.length < 3) {
    return [];
  }
  const wikiEntityLikingResponse = await fetch(
    `https://cors-anywhere.herokuapp.com/https://opentapioca.org/api/annotate?query=${encodeURI(
      query
    )}`,
    {
      method: "GET",
      mode: "cors",
      headers: headers
    }
  );
  console.log(wikiEntityLikingResponse);
  let wikiEntityLiking;
  try {
    wikiEntityLiking = await wikiEntityLikingResponse.json();
  } catch (error) {
    console.log(error);
    return [];
  }
  console.log(wikiEntityLiking);
  let qid_list = wikiEntityLiking.annotations.map(
    each_match => each_match.best_qid
  );
  qid_list = qid_list.filter(quid => !!quid);
  console.log(qid_list);
  return qid_list;
  // return ['Q712548', 'Q9570'];
}

export { entityMatch };
