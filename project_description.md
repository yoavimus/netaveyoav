# description:
this is a very simple project, a web app with pc and mobile visibility, the web will display a catalog of shirt desigs of the "NetaVeYoav" design brand.
simple is the name of the game

# purpose:
purpose is to display the designs and shirts for sale in an wasy and accsesible manner


# info
there will be appx 5 designs. each design will have some of the shirt style options [unisex t-shirt, footer/jumper (simple long sleeved shirt), womens t-shirt, hoodie], and color options [black, offwhwite, etc]

each design will be displayed as a picture with options to select shirt style and a color selector.

display should work on both mobile and desktop.

## hosting
will be railways.

## tech stack
i like python, the rest is up to you
initialize as a public git repo on my ususal user

## claude code setup
inherit relevant settings from project therapAI and from global claude settengs

## clarifications:
### questions
  1. Static vs dynamic catalog — Is this a static display (no cart/checkout) or do you need any backend logic (e.g., product management, inventory)? Since there are only ~5 designs, a        static frontend with Python serving it might be all you need.                                                                                                                                2. Cart / purchase flow — Do users need to add to cart or buy, or just browse (e.g., link out to Etsy/external store)?                                                                       3. Images — Do you already have design images, or should I set up placeholder slots for them?                                                                                                4. GitHub username — You said "my usual user" — is that yoavb or something else? (I don't have this in memory yet.)                                                                          5. Railway service name — Any preference, or just netaveyoav?   
### answers:
1. lets start with the simplest approach - static
2. just browsing
3. setup placeholder slots, after i will finish getting all images i will copy them to folder images/~design name~/~style and color~ (or do you reccomend a better way?)
4. yoavimus
5. netaveyoav