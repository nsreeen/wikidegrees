# FROM rust:1.60 as builder
# WORKDIR /usr/src/wikidegrees
# COPY . .
# RUN cargo install --path .

# FROM debian:buster-slim
# RUN apt-get update
# RUN apt-get install -y libssl-dev
# RUN rm -rf /var/lib/apt/lists/*
# COPY --from=builder /usr/local/cargo/bin/wikidegrees /usr/local/bin/wikidegrees
# CMD ["wikidegrees"]

FROM rust:1.60
RUN apt-get update
RUN apt-get install -y libssl-dev
WORKDIR /usr/src/wikidegrees
COPY . .
RUN cargo install --path .
CMD ["wikidegrees"]
