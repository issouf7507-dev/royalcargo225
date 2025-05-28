"use client";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { postLog } from "@/app/api";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import Image from "next/image";

const queryClient = new QueryClient();

const formSchema = z.object({
  user: z.string(),
  passwd: z.string().min(4),
});

const Page = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <PageRef />
    </QueryClientProvider>
  );
};

const PageRef = () => {
  const navigation = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user: "",
      passwd: "",
    },
  });

  const { isPending, mutate } = useMutation({
    mutationFn: (variables: any) => {
      return postLog(variables);
    },
  });

  const [isLoading, setIsLoading] = React.useState(false);
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutate(values, {
      onSuccess: (data) => {
        if (data == "User not found") {
          console.log(data);
          toast.success("Cet utilisateur n'existe pas. 😣");
        } else if (data == "Incorrect password") {
          toast.success("Mot de pas incorrect. 😣");
        } else {
          Cookies.set("access_connect", JSON.stringify(data), {
            expires: 1,
            sameSite: "strict",
          });
          setIsLoading(true);
          setTimeout(() => {
            toast.success("Succes 👌");
            navigation.push("/dashboard");
            setIsLoading(false);
          }, 3000);
        }
      },
      onError: (error) => {
        if (error) {
          // toast.error("error");
        }
      },
    });
  }

  return (
    <section className="w-full h-screen flex flex-col gap-5 items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Connexion</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="user"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom d'utilisateur</FormLabel>
                    <FormControl>
                      <Input placeholder="Nom d'utilisateur" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mot de passe"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Se connecter</Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div>
        {isLoading && (
          <Image src="/tail-spin.svg" width={30} height={30} alt="" />
        )}
      </div>
    </section>
  );
};

export default Page;
