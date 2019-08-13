import { NodeSpiClient } from "./services/NodeSpiClient";
import { Mcp3008, Channels } from "./services/Mcp3008";

(async function () {
    console.log("Hello World");

    const spiClient = new NodeSpiClient();
    const mcp = new Mcp3008(spiClient, 0);

    try {
        const reading = await mcp.read(Channels.Single0);
        console.log("reading...");
        console.log(reading);
    } catch (error) {
        console.log(`CATCH: ${error}`);
    }
})();
