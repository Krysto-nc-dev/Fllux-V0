import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { pricingCards } from '@/lib/constants'
import clsx from 'clsx'
import { Check } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <>
      <section className="h-full w-full pt-36 relative flex items-center justify-center flex-col mt-[-60px] ">
        {/* grid */}
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
        <p className="text-center lg:mt-[200px]">Gestion de business tout en un </p>
        <div className="bg-gradient-to-r from-primary to-secondary-foreground text-transparent bg-clip-text relative">
          <h1 className="text-9xl font-bold text-center md:text-[300px] leading-none">
           Fllux
          </h1>
        </div>
        <div className="flex justify-center relative items-center mt-[-20px] md:mt-[-70px]">
          <Image
            src="/assets/preview.png"
            alt="banner image"
            width={1200}
            height={1200}
            className="rounded-tl-2xl rounded-tr-2xl border-2 border-muted"
          />
          <div className="bottom-0 top-[50%] bg-gradient-to-t dark:from-background left-0 right-0 absolute z-10"></div>
        </div>
      </section>
      <section className="flex justify-center items-center flex-col gap-4 md:mt-20 mt-[-60px]">
        <h2 className="text-3xl text-center p-2">
          Choisissez ce qui vous convient le mieux
        </h2>
        <p className="text-muted-foreground text-center">
          Nos plans de tarification simples sont adaptés à vos besoins. Si vous
          n'êtes pas <br /> prêt à vous engager, vous pouvez commencer
          gratuitement.
        </p>
        <div className="flex justify-center gap-4 flex-wrap mt-6">
          {pricingCards.map((card) => (
            // WIP: WIRE UP FREE PRODUCT FROM STRIPE
            <Card
              key={card.title}
              className={clsx('w-[300px] flex flex-col justify-between', {
                'border-2 border-primary': card.title == 'Pro',
              })}
            >
              <CardHeader>
                <CardTitle
                  className={clsx({
                    'text-muted-foreground': card.title != 'Pro',
          
                  })}
                >
                  {card.title}
                </CardTitle>
                <CardDescription>{card.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">{card.price}</span>
                {
                  card.title === "Sur-mesure" ? (
                    <p className="text-muted-foreground text-sm">
                      Disponible à la demande
                    </p>
                  ) : (
                    <p className="text-muted-foreground font-bold">/Mois</p>
                  )
                }
               
              </CardContent>
              <CardFooter className="flex flex-col items-start gap-4">
                <div>
                  {card.features.map((feature) => (
                    <div key={feature} className="flex gap-2 items-center">
                      <Check className="text-muted-foreground" />
                      <p>{feature}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href={card.title === "Sur-mesure" ? `/contact?plan=${card.priceId}` : `/agency?plan=${card.priceId}`}
                  className={clsx(
                    'w-full text-center bg-primary p-2 rounded-md',
                    {
                      '!bg-muted-foreground': card.title !== 'Pro',
                      '!bg-muted-foreground': card.title !==  'Sur-mesure',
                    }
                  )}
                >
                  {card.title === "Sur-mesure" ? "Nous contacter" : "Commencer"}
                
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </>
  )
}
