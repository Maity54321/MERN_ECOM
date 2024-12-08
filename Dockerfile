FROM node:20

WORKDIR usr/src/app

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=4000
ENV DB_URI=mongodb://127.0.0.1:27017/ecomDB
ENV DB_URI_ON=mongodb+srv://maityjeet786:Maity54321@cluster0.trfdnn2.mongodb.net/?retryWrites=true&w=majority

ENV DB_URI_ON_NEW=mongodb+srv://maityjeet786:Maity54321@cluster0.trfdnn2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0

ENV CLOUDINARY_CLIENT_NAME=dhsrlqlyn
ENV CLOUDINARY_CLIENT_API=392346687891884
ENV CLOUDINARY_CLIENT_SECRET=dWHmgmG1kz3XZCYfptKpsEPtOLA

ENV RAZORPAY_API_KEY=rzp_test_u5bBccRSp8WTVv
ENV RAZORPAY_SECRET_KEY="gxQ9XezpmYZhYwmCjRDbapPU"

#Expose Port
EXPOSE 4000

CMD npm run start