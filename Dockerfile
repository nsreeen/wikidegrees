# FROM rust:1.60 as build
#
# RUN USER=root cargo new --bin wikidegrees
# WORKDIR /wikidegrees
#
# COPY ./Cargo.lock ./Cargo.lock
# COPY ./Cargo.toml ./Cargo.toml
# RUN cargo build --release
#
# # RUN rm src/*.rs
# # COPY ./src ./src
# #
# # RUN rm ./target/release/deps/wikidegrees*
# # RUN cargo build --release
#
# FROM debian:buster-slim
# COPY --from=build /wikidegrees/target/release/wikidegrees .
#
# CMD ["./wikidegrees"]

FROM rust:1.60 as builder
WORKDIR /usr/src/wikidegrees
COPY . .
RUN cargo install --path .

FROM debian:buster-slim
RUN apt-get update && apt-get install -y libssl-dev && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/wikidegrees /usr/local/bin/wikidegrees
CMD ["wikidegrees"]
