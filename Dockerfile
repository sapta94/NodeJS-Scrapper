#base image
FROM node:alpine 

#set up a working directoy
WORKDIR '/app'


# copy package.json
COPY package.json .

# installation command
RUN npm install

# copy contents of the folder into the container
COPY . .

# default startup command
CMD ["npm","start"]

## while doing docker run do not forget to implement port mapping 
## (docker run -p <your_port>:<container_port> <image_id>)