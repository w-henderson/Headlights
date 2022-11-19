mod start;

use crate::State;

use humphrey::http::{Request, Response, StatusCode};
use humphrey_json::prelude::*;

use std::sync::Arc;

pub fn start(_: Request, state: Arc<State>) -> Response {
    let dataset = start::get_random_dataset(&state.data);
    let (start, end, question) = start::get_random_year_range(dataset.start, dataset.end);

    let json = json!({
        "id": dataset.id,
        "name": dataset.name,
        "time": format!("{}-{}", start, end),
        "question": question.to_string()
    });

    Response::new(StatusCode::OK, json.serialize())
}

pub fn series(request: Request, state: Arc<State>) -> Response {
    Response::new(StatusCode::OK, "Hello, world!")
}

pub fn point(request: Request, state: Arc<State>) -> Response {
    Response::new(StatusCode::OK, "Hello, world!")
}

pub fn search(request: Request, state: Arc<State>) -> Response {
    Response::new(StatusCode::OK, "Hello, world!")
}
