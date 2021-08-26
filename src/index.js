(async () => {
  /********BE CAREFUL WHAT YOU DELETE BELOW THIS LINE********/

  // Get the configuration information from the config.js file
  const config = await await fetch("config").then(response => response.json());

  // Create a JWT token for authenticating the user to a QCS session
  const token = await await fetch("token").then(response => response.json());

  const login = await await fetch(
    `https://${config.tenantDomain}/login/jwt-session?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      method: "POST",
      credentials: "include",
      mode: "cors",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token.token}`,
        "qlik-web-integration-id": config.qlikWebIntegrationId
      },
      rejectunAuthorized: false
    }
  );

  //Get the cross-site scripting token to allow requests to QCS from the web app
  const csrfTokenInfo = await await fetch(
    `https://${config.tenantDomain}/api/v1/csrf-token?qlik-web-integration-id=${config.qlikWebIntegrationId}`,
    {
      credentials: "include",
      headers: {
        "Qlik-Web-Integration-ID": config.qlikWebIntegrationId
      }
    }
  );

  // Build the websocket URL to connect to the Qlik Sense applicaiton
  const url = `wss://${config.tenantDomain}/app/${
    config.appId
  }?qlik-web-integration-id=${
    config.qlikWebIntegrationId
  }&qlik-csrf-token=${csrfTokenInfo.headers.get("qlik-csrf-token")}`;

  // Fetch the schema for communicating with Qlik's engine API
  const schema = await (await fetch(
    "https://unpkg.com/enigma.js/schemas/3.2.json"
  )).json();

  // Create Qlik engine session
  const session = window.enigma.create({ schema, url });

  // Open the application
  const app = await (await session.open()).openDoc(config.appId);

  /********BE CAREFUL WHAT YOU DELETE ABOVE THIS LINE********/

  const themeFile = await await fetch("theme/horizon").then(response =>
    response.json()
  );
  console.log(themeFile);

  // Create embed configuration
  const nuked = window.stardust.embed(app, {
    context: { theme: "dark" },
    types: [
      {
        name: "barchart",
        load: () => Promise.resolve(window["sn-bar-chart"])
      },

      {
        name: "action-button",
        load: () => Promise.resolve(window["sn-action-button"])
      },
      {
        name: "combochart",
        load: () => Promise.resolve(window["sn-combo-chart"])
      },

      {
        name: "bullet-chart",
        load: () => Promise.resolve(window["sn-bullet-chart"])
      },

      {
        name: "funnel-chart",
        load: () => Promise.resolve(window["sn-funnel-chart"])
      },
      {
        name: "scatterplot",
        load: () => Promise.resolve(window["sn-scatter-plot"])
      },

      {
        name: "grid-chart",
        load: () => Promise.resolve(window["sn-grid-chart"])
      },
      {
        name: "line-chart",
        load: () => Promise.resolve(window["sn-line-chart"])
      },
      {
        name: "mekko",
        load: () => Promise.resolve(window["sn-mekko-chart"])
      },
      {
        name: "piechart",
        load: () => Promise.resolve(window["sn-pie-chart"])
      },
      {
        name: "table",
        load: () => Promise.resolve(window["sn-table"])
      },
      {
        name: "kpi",
        load: () => Promise.resolve(window["sn-kpi"])
      },
      {
        name: "sankey",
        load: () => Promise.resolve(window["sn-sankey-chart"])
      }
    ]
  });

  (await nuked.selections()).mount(document.querySelector(".toolbar"));

  nuked.render({
    type: "barchart",
    element: document.querySelector(".object"),
    fields: ["Decade", "=Count(Distinct Title)"],
    options: {
      direction: "rtl",
      freeResize: true,
      viewState: {
        scrollPosition: 25
      }
    },
    properties: {
      color: { mode: "byDimension" },
      orientation: "horizontal",
      title: "Bar Chart"
    }
  }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "combochart",
      fields: ["Decade", "=Avg(Length)", "=Max(Length)"],
      properties: {
        title: "Combo Chart",
        components: [
          {
            key: "bar",
            style: {
              strokeWidth: "large",
              strokeColor: {
                color: "white"
              }
            }
          },
          {
            key: "line",
            style: {
              lineThickness: 3,
              lineCurve: "monotone"
            }
          }
        ],
        dataPoint: {
          show: true
        }
      }
    });

  nuked.render({
    element: document.querySelector(".object"),
    type: "bullet-chart",
    fields: ["Decade", "=Count(Distinct Title)"],
    properties: {
      title: "Bullet Chart",
      color: { mode: "byDimension" }
    }
  }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "funnel-chart",
      fields: ["Decade", "=Count(Distinct Title)"],
      properties: {
        title: "Funnel Chart"
      }
    }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "scatterplot",
      fields: ["Decade", "=Avg(Length)", "=Max(Length)"],
      properties: {
        title: "Scatter Plot",
        color: { mode: "byDimension" }
      }
    }),
    //     nuked.render({
    //   element: document.querySelector('.object'),
    //   type: "grid-chart",
    //   fields: ['Director', 'Decade', '=Count(Distinct Title)'],
    //   properties: {
    //     title: 'Grid Chart',
    //   },
    // }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "line-chart",
      fields: ["Decade", "=Max(Length)"],

      // Overrides default properties
      properties: {
        title: "Line Chart",
        lineType: "area",
        //color: '#33ccff',
        dataPoint: {
          show: true,
          showLabels: true
        },
        gridLine: {
          auto: false
        },
        dimensionAxis: {
          show: "all",
          dock: "near"
        },
        measureAxis: {
          spacing: 0.5,
          dock: "near",
          show: "all",
          logarithmic: true
        }
      }
    }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "mekko",
      fields: ["Decade", "Rating", "=Count(Distinct Title)"]
    }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "piechart",
      fields: ["Decade", "=Count(Distinct Actor)"],

      // Overrides default properties
      properties: {
        title: "Pie Chart",
        dataPoint: {
          labelMode: "none"
        }
      }
    }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "table",
      fields: ["Actor", "=Count(Distinct Title)"]
    }),
    nuked.render({
      type: "action-button",
      element: document.querySelector(".object_new"),
      properties: {
        actions: [
          {
            actionType: "selectValues",
            field: "Year",
            value: "1941",
            softLock: false
          }
        ],
        style: {
          label: "Make selections",
          font: {
            size: 0.8,
            style: {
              bold: true
            }
          },
          background: {
            color: "SpringGreen"
          },
          border: {
            useBorder: true,
            radius: 1,
            width: 0,
            color: "Green"
          },
          icon: {}
        }
      }
    }),
    nuked.render({
      type: "action-button",
      element: document.querySelector(".object_new"),
      properties: {
        actions: [
          {
            actionType: "clearAll",
            softLock: false
          }
        ],
        style: {
          label: "Clear selections",
          font: {
            size: 0.8,
            style: {
              bold: true
            }
          },
          background: {
            color: "Red"
          },
          border: {
            useBorder: true,
            radius: 1,
            width: 0,
            color: "DarkRed"
          },
          icon: {}
        }
      }
    }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "kpi",
      fields: ["=Count(Distinct Title)"],
      properties: {
        title: "KPI"
      }
    }),
    nuked.render({
      element: document.querySelector(".object"),
      type: "sankey",
      fields: ["Decade", "Length Range", "Rating", "=Max(Length)"],
      // overrides default properties
      properties: {
        node: {
          padding: 0.2,
          width: 0.3
        },
        link: {
          opacity: 0.5,
          shadow: false,
          color: 3,
          colorBy: "custom"
        }
      }
    });
})();
