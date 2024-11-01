FROM mariadb:latest

COPY initdb.sh /docker-entrypoint-initdb.d/initdb.sh
COPY backend_searchVeto_data.tar.gz /docker-entrypoint-initdb.d/backend_searchVeto_data.tar.gz

RUN chmod +x /docker-entrypoint-initdb.d/initdb.sh
