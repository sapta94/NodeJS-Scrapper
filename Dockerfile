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