"use client";

import { useUser } from "@auth0/nextjs-auth0/client";
import Script from "next/script";
import { useEffect, useState } from "react";
import { type Subscription, getSubscriptionAction } from "./actions";
import ApiKeyManager from "@zuplo/react-api-key-manager";
import { useZuploContext } from "./zuplo-provider";

export default function Home() {
  const provider = useZuploContext();
  const { user, isLoading } = useUser();
  const [subscription, setSubscription] = useState<Subscription>();

  useEffect(() => {
    if (!user) return;
    if (!user.email) return;
    getSubscriptionAction(user.email).then(setSubscription);
  }, [user]);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <header className="bg-gray-50">
        <div className="container mx-auto py-4 items-center text-black flex justify-between">
          <div>ZuploApiPaywall</div>

          <div className="flex gap-4 items-center">
            {user && (
              <>
                <div>{user.email}</div>
                <a
                  className="bg-pink-500 hover:bg-pink-600 rounded text-white px-4 py-2"
                  href="/api/auth/logout"
                >
                  logout
                </a>
              </>
            )}

            {!user && (
              <a
                className="bg-pink-500 hover:bg-pink-600 rounded text-white px-4 py-2"
                href="/api/auth/login"
              >
                login
              </a>
            )}
          </div>
        </div>
      </header>

      <main className="flex min-h-screen flex-col items-center gap-12 p-24">
        {user ? (
          <>
            <h1 className="text-4xl font-bold">
              Welcome to your API Dashboard
            </h1>

            <p>
              You can view the documentation{" "}
              <a
                className="text-pink-500"
                target="_blank"
                href="https://money-api-zup-main-93fbea4.d2.zuplo.dev/docs"
              >
                here
              </a>
              .
            </p>
            {subscription && provider && (
              <ApiKeyManager
                provider={provider}
                enableDeleteConsumer={true}
                enableCreateConsumer={true}
              />
            )}
            {!subscription && (
              <>
                <Script async src="https://js.stripe.com/v3/pricing-table.js" />
                <div
                  dangerouslySetInnerHTML={{
                    __html: `
              <stripe-pricing-table
              pricing-table-id="prctbl_1PyT77HEAhCT4x6gq3Q1M3xz"
              publishable-key="pk_live_51PV8r6HEAhCT4x6gr6VtE1isUatujBBwWPbuPd9Ud9Dc2tUj0CIT8BDIHFGNfJePtK4jyFgTv6I7hcUwqIdMW3kd00WDpol12G"
            ></stripe-pricing-table>`,
                  }}
                ></div>
              </>
            )}
          </>
        ) : (
          <>
            <h1 className="text-4xl font-bold">
              Welcome to the Zuplo API Paywall
            </h1>

            <a
              className="bg-pink-500 hover:bg-pink-600 rounded text-white px-4 py-2"
              href="/api/auth/login"
            >
              Login to Start
            </a>
          </>
        )}
      </main>
    </>
  );
}
