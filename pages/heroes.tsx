import { AddHeroContextProvider } from "@/Components/Heroes/AddHeroContext";
import AddHeroPage from "@/Components/Heroes/AddHeroPage";
import { QueryClient, dehydrate, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import {
  getAllSentientsInUsersVanguard,
  getAllSentientsNotInUsersVanguard,
} from "@/services/heroes/handleHeroes";
import { useSession } from "next-auth/react";
import { sentient } from "@prisma/client";
import LoadingSpinner from "@/Components/CustomComponents/LoadingSpinner";
import getSentientFullName from "@/utilities/helperFn/getSentientFullName";
import { withServerSessionGuard } from "@/utilities/functions/getServerSideSession";

const Heroes = () => {
  const { data: session } = useSession();
  const user = session?.user;
  const { data: sentientsNOTInUsersVanguard } = useQuery<sentient[], Error>({
    queryKey: [
      "getAllSentientsNotInUsersVanguard",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: async () => {
      const { data: sentientsNOTInUsersVanguard } = await axios.get(
        `/api/heroes/getAllSentientsNotInUsersVanguard/${user?.user_id}`
      );
      return sentientsNOTInUsersVanguard;
    },
    enabled: !!user,
  });
  const { data: heroesInUsersVanguard } = useQuery<sentient[], Error>({
    queryKey: [
      "getAllSentientsInUsersVanguard",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],

    queryFn: async () => {
      const { data: heroesInUsersVanguard } = await axios.get(
        `/api/heroes/getAllSentientsInUsersVanguard/${user?.user_id}`
      );
      return heroesInUsersVanguard;
    },
    enabled: !!user,
  });

  if (!sentientsNOTInUsersVanguard || !heroesInUsersVanguard) {
    return <LoadingSpinner />;
  }

  return (
    <AddHeroContextProvider>
      {heroesInUsersVanguard.map((el) => (
        <p key={el.sentient_id}>{getSentientFullName(el)}</p>
      ))}
      <AddHeroPage
        sentientsNOTInUsersVanguard={sentientsNOTInUsersVanguard}
        heroesInUsersVanguard={heroesInUsersVanguard}
      />
    </AddHeroContextProvider>
  );
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { session } = await withServerSessionGuard(context);
  const user = session?.user;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [
      "getAllSentientsNotInUsersVanguard",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: () =>
      getAllSentientsNotInUsersVanguard({
        world_id: user?.selectedWorld?.location_id as number,
        user_id: Number(user?.user_id),
      }),
  });
  await queryClient.prefetchQuery({
    queryKey: [
      "getAllSentientsInUsersVanguard",
      { user_id: user?.user_id },
      { world_id: user?.selectedWorld?.location_id },
    ],
    queryFn: () =>
      getAllSentientsInUsersVanguard({
        world_id: user?.selectedWorld?.location_id as number,
        user_id: Number(user?.user_id),
      }),
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};

export default Heroes;
