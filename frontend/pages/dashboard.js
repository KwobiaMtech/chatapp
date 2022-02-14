// import { withPageAuthRequired } from "@auth0/nextjs-auth0";


// export default function Dashboard(){
//     return <div>dashboard</div>

// }

// export const getServerSideProps = withPageAuthRequired();

import { useUser } from '@auth0/nextjs-auth0';

export default function Dashboard() {
  const { user, error, isLoading } = useUser();

  // make sure we wait for everything to load
  if (isLoading) return <div>Loading...</div>;

  // if theres an error, show that
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <h1>Dashboard</h1>

      {/* show the user information */}
      {user && (
        <>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </>
      )}
    </div>
  );
}
export const getServerSideProps = withPageAuthRequired();