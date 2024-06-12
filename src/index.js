const express = require('express');
const rateLimit  = require('express-rate-limit');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { ServerConfig } = require('./config');
const apiRoutes = require('./routes');

const app = express();

const limiter = rateLimit({
	windowMs: 2 * 60 * 1000, // 2 minutes
	limit: 3, // Limit each IP to 3 requests per `window` (here, per 2 minutes).
	});

app.use(express.json());   //help to parse the incoming request body 
app.use(express.urlencoded({extended:true}));  

app.use(limiter)

app.use(
    '/flightsService',
    createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
    }),
  );

  app.use(
    '/bookingsService',
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: true,
    }),
  );

app.use('/api', apiRoutes);

app.listen(ServerConfig.PORT, () => {
    console.log(`Successfully started the server on PORT : ${ServerConfig.PORT}`);
});
