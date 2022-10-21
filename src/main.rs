use std::net::SocketAddr;

use axum::{extract::Path, http::StatusCode, routing::get, Router};
use openssl_probe::init_ssl_cert_env_vars;
use rand::Rng;
use reqwest;
use soup::{Soup, NodeExt, QueryBuilderExt};
use tokio;
use tower_http::cors::CorsLayer;

#[tokio::main]
async fn main() {
    init_ssl_cert_env_vars();

    let app = Router::new()
        .route("/get_links/:url_suffix", get(get_links_handler))
        .route("/health", get(health_handler))
        .layer(CorsLayer::new().allow_origin("https://nsreeen.github.io/wikidegrees/"));

    let address = SocketAddr::from(([0, 0, 0, 0], 8080));
    axum::Server::bind(&address)
       .serve(app.into_make_service())
       .await
        .unwrap();
}

async fn health_handler() -> (StatusCode, String) {
    (StatusCode::OK, "up and running".to_owned())
}

async fn get_links_handler(Path(url_suffix): Path<String>) -> (StatusCode, axum::Json<[String;6]>) {
    let initial_url = "https://en.wikipedia.org/wiki/".to_owned() + &url_suffix;
    let mut urls: [String;6] = Default::default();
    urls[0] = initial_url;
    for i in 1..6 {
        match get_random_onward_url(&urls[i-1]).await {
            Ok(url) => {
                urls[i] = url;
            },
            Err(e) => {
                println!("error: {}", e);
                return (StatusCode::INTERNAL_SERVER_ERROR, axum::Json(urls));
            }
        }
    }
    return (StatusCode::OK, axum::Json(urls));
}

async fn get_random_onward_url(url: &str) -> Result<String, reqwest::Error> {
    let text = reqwest::get(url).await?.text().await?;
    let content = Soup::new(&text).tag("div").attr("id", "bodyContent").find();
    let links = content.expect("should have content")
        .tag("a").find_all()
        .map(|a| match a.get("href") {
            Some(href) => href,
            None => String::new()
        })
        .filter(|href| href.starts_with("/wiki/")
            && !href.contains(":"))
        .collect::<Vec<_>>();
    let random_index = rand::thread_rng().gen_range(0..links.len());
    let new_url = "https://en.wikipedia.org".to_owned() + &links[random_index];
    return Ok(new_url);
}
