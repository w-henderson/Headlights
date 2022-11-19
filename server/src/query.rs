use form_urlencoded::parse;

pub fn parse_query_string(q: impl AsRef<str>) -> Option<Vec<(String, String)>> {
    Some(
        parse(q.as_ref().as_bytes())
            .map(|(k, v)| (k.to_string(), v.to_string()))
            .collect(),
    )
}
