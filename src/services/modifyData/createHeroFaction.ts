import { location } from "@prisma/client";
import { prisma } from "../../../prisma/prisma";

export async function createHeroFaction(
  selectedWorld: location,
  newFactionName: string
) {
  try {
    const isFactionUnique = await prisma.faction.findFirst({
      where: {
        faction_name: newFactionName,
        world_id: selectedWorld.location_id,
      },
    });
    if (!isFactionUnique) {
      throw new Error("Faction name exists");
    }
    const createdFaction = await prisma.faction.create({
      data: {
        faction_name: newFactionName,
        is_hero_faction: true,
        world_id: selectedWorld.location_id,
      },
    });
    return createdFaction;
  } catch (error) {
    throw error;
  }
}
