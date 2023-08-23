import type { NextPage } from "next";
import Head from "next/head";
import AuthContainer from "../components/auth/AuthContainer";
import Spinner from "../components/Spinner";
import { getAuth } from "firebase/auth";
import app from "../firebase";
import Dashboard from "../components/dashboard/Dashboard";
import { useAuthState } from "react-firebase-hooks/auth";

const Home: NextPage = () => {
  const auth = getAuth(app);
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <Spinner />;
  }

  if (!user && !loading) {
    return <AuthContainer />;
  }

  if (error) {
    return "Something went wrong";
  }

  return (
    <div>
      <Head>
        <title>Stackruit - TODO</title>
        <meta name="description" content="A Todo app by stackruit" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {!loading && user && <Dashboard user={user} />}
    </div>
  );
};

export default Home;
