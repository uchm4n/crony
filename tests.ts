import {
    assert,
    assertEquals,
    assertStrContains,
} from "https://deno.land/std/testing/asserts.ts";
import {Crony} from "../crony/mod.ts";

const crony = new Crony();
const config = crony.getDefaultConfig();

Deno.test("test default config", () => {
    config.name = "TEST";
    assert(crony);
    assertStrContains(config.schedule, "* * * * *");
    assertEquals(config.enabled, false);
    assertEquals(config.command, "");
});

Deno.test("test add function", () => {
    config.command = () => console.log("command test");
    crony.add(config);
});

Deno.test("test run function", async () => {
    config.enabled = true;
    config.debug = true;
    await crony.run();
});
