type TFeed = {
  id: string;
  title: string;
};

export default async function Home() {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/${process.env.NEXT_PUBLIC_API_PATH}/feeds`
  );
  const feeds: TFeed[] = await res.json();

  return (
    <ul>
      {feeds.map((feed) => (
        <li key={feed.id}>{feed.title}</li>
      ))}
    </ul>
  );
}
