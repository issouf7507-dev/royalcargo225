"use client";
import React from "react";
import { motion } from "framer-motion";
import Footer from "@/components/footer";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = () => {
  return (
    <section>
      <div className="h-[50vh] flex items-center justify-center">
        <motion.h1
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "tween",
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.25, 0.25, 0.75],
          }}
          className="text-center  text-3xl font-bold text-[#1a76cb]  md:text-6xl"
        >
          Contacter nous
        </motion.h1>
      </div>

      <div className="flex flex-col gap-10 px-4 md:px-28">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              type: "tween",
              duration: 0.8,
              delay: 0.6,
              ease: [0.25, 0.25, 0.25, 0.75],
            }}
            className="text-start text-2xl font-bold text-[#1a76cb] mb-2 md:text-3xl"
          >
            Nous sommes là pour vous aider ! Si vous avez des questions, des
            préoccupations ou des suggestions, n'hésitez pas à nous contacter
            par l'un des moyens suivants :
          </motion.h2>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "tween",
            duration: 0.8,
            delay: 0.9,
            ease: [0.25, 0.25, 0.25, 0.75],
          }}
        >
          <Card className="w-[350px]">
            <CardHeader>
              <CardTitle>Informations de contact</CardTitle>
              {/* <CardDescription>
                Deploy your new project in one-click.
              </CardDescription> */}
            </CardHeader>
            <CardContent>
              <div>
                <h1>Adresse :</h1>
                <p>
                  Boulevard du Cameroun ligne 11 grand marché de Marcory abidjan
                  Côte d'Ivoire
                </p>
              </div>
              <div>
                <h1>Téléphone :</h1>
                <p>+225 0564919216</p>
                <p>+225 0708201212</p>
                <p>+86 186 2097 5453 </p>
                <p>+86 188 0207 2454</p>
              </div>
              <div>
                <h1>Email :</h1>
                <p>royalcargo225@gmail.com</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </section>
  );
};

export default Page;
