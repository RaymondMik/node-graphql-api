#GET STARTED
yarn

#DEPLOY Docker comntainer to Prisma
dev: prisma deploy -e ../config/dev.env
prod: prisma deploy -e ../config/prod.env
test: prisma deploy -e ../config/test.env

#Heroku commands needed here
git push heroku master
##Setup env variables
heroku config:set key=value
heroku config:get key