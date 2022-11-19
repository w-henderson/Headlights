use crate::State;

use humphrey::http::{Request, Response, StatusCode};

use std::sync::Arc;

pub fn start(request: Request, state: Arc<State>) -> Response {
    Response::new(StatusCode::OK, "Hello, world!")
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
