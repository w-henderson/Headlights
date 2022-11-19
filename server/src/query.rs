pub fn parse_query_string(q: impl AsRef<str>) -> Option<Vec<(String, String)>> {
    let mut result = Vec::new();
    let records = q.as_ref().split('&');

    for record in records {
        let mut record = record.splitn(2, '=');

        let key = record.next()?.to_string();
        let value = record.next()?.to_string();

        result.push((key, value));
    }

    Some(result)
}
