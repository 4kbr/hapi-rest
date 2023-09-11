"use strict";

import dotenv from "dotenv";
dotenv.config();
import Hapi from "@hapi/hapi";
import HapiGeoLocate from "hapi-geo-locate";

interface Reqquest {
  location: string;
  [key: string]: string;
}

const init = async (): Promise<void> => {
  const server = new Hapi.Server({
    host: process.env.HOST || "localhost",
    port: process.env.PORT || 9876,
  });

  await server.register([
    {
      plugin: HapiGeoLocate,
      options: {
        enabledByDefault: false,
      },
    },
  ]);

  server.route([
    {
      method: "GET",
      path: "/",
      handler: (request, h) => {
        return "<h1>Hello Word</h1>";
      },
    },
    {
      method: "GET",
      path: "/location",
      handler: (request: Reqquest, h) => {
        if (request.location) {
          return request.location;
        } else {
          return `<h1>Your location is not enabled by default!</h1>`;
        }
      },
    },
    {
      method: "GET",
      path: "/users/{dinamicparam}",
      handler: (request, h) => {
        console.log(request.params);
        return `<h1>Hello ${request.params.dinamicparam}</h1>`;
      },
    },
    {
      method: "GET",
      path: "/query/{query?}",
      handler: (request, h) => {
        return `<h1>Hello ${request.query.name}, kamu: ${request.query.lastname}</h1>`;
      },
    },
    {
      method: "GET",
      path: "/{any*}",
      handler: (request, h) => {
        return `<h1>Ente nyasar</h1>`;
      },
    },
  ]);

  await server.start();
  console.log(`server start on: ${server.info.uri}`);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
