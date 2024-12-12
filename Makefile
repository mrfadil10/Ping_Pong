all:
	docker-compose up

wipe:
	docker stop $(docker ps -aq); docker rm $(docker ps -aq); docker rmi $(docker images -aq); docker network rm $(docker network ls); docker volume rm $(docker volume ls); docker system prune -af;