import path from "path";
import {MatchersV3, PactV3, PactV3Options} from "@pact-foundation/pact/v3";
import {V3MockServer} from "@pact-foundation/pact/src/v3/pact";

// const {
//   eachLike,
//   atLeastLike,
//   integer,
//   timestamp,
//   boolean,
//   string,
//   regex,
//   like,
// } = MatchersV3;

/**
 * @jest-environment jsdom
 */
describe('@huluvu424242/honey-feeds prüfe contracts gegen', () => {

  const OPTIONS: PactV3Options = {
    // port: 1234, wird dynamisch vom server ermittelt
    dir: path.resolve(process.cwd(), "contracts"),
    //   log: path.resolve(process.cwd(), "logs", "mockserver-integration.log"),
    consumer: "honey-news#",
    provider: "#liona-feeds",
  };

  const provider: PactV3 = new PactV3(OPTIONS);

  const ACCEPT_HEADER: MatchersV3.Matcher<"application/json"> = MatchersV3.like(
    "application/json",
    // "application/rss+xml",
    // "application/xml",
    // "application/xhtml+xml",
    // "text/xtml"
  )

  const RESPONSE_3 = [
    {
      "url": "https://www.presseportal.de/rss/presseportal.rss2",
      "countRequested": 4,
      "countContacted": 0,
      "countResponseOK": 1
    },
    {
      "url": "https://www.tagesschau.de/xml/atom/",
      "countRequested": 4,
      "countContacted": 1,
      "countResponseOK": 1,
      "score": 0
    },
    {
      "url": "https://dev.to/feed/",
      "countRequested": 4,
      "countContacted": 1,
      "countResponseOK": 1,
      "score": 4
    }
  ];


  describe("@huluvu424242/liona-feeds", () => {

    it("Abruf eines RSS 2.0 Feeds", () => {

      // Vorbedingung herstellen (Contract definieren)
      // PACT Matchers verwenden
      provider
        .given("Frage Statistik ab")
        .uponReceiving("Zu allen Feeds:")
        .withRequest({
          method: "GET",
          path: "/feeds",
          headers: {
            Accept: ACCEPT_HEADER
          }
        })
        .willRespondWith({
          status: 200,
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: RESPONSE_3,
        });

      // Test ausführen
      // JEST Matchers verwenden
      return provider.executeTest(async (mockServer: V3MockServer) => {
        console.log("######### P O R T:" + mockServer.port);
        console.log("######### U R L:" + mockServer.url);
        console.log("######### I D:" + mockServer.id);

        await changeLionaFeedsAPIUrlTo(mockServer.url);

        const statisticData: StatisticData[] = await loadFeedRanking(mockServer.url+"/feeds");
        const statisticExample = [
          {
            "url": "https://www.presseportal.de/rss/presseportal.rss2",
            "countRequested": 4,
            "countContacted": 0,
            "countResponseOK": 1,
            "score": undefined // TODO in Zukunft 0
          },
          {
            "url": "https://www.tagesschau.de/xml/atom/",
            "countRequested": 4,
            "countContacted": 1,
            "countResponseOK": 1,
            "score": 0
          },
          {
            "url": "https://dev.to/feed/",
            "countRequested": 4,
            "countContacted": 1,
            "countResponseOK": 1,
            "score": 4
          }
        ];
        expect(statisticData).toStrictEqual(statisticExample);
      });


    });
  });

})
;
