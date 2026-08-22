// Single source of truth for the site's prose.
//
// The homepage components render these strings as JSX, and lib/markdown.ts
// renders the same strings as Markdown for agents asking for
// `Accept: text/markdown`. Editing the copy here updates both representations,
// so the HTML and Markdown variants of a URL can never drift apart.

export const heroContent = {
  headline: 'Building. Shooting. Moving.',
};

export const musicContent = {
  heading: 'Music',
  intro:
    "What I love about concerts is that everyone there is like-minded. We're all there to see an artist we love, even if our lives are completely different outside of it. I can walk up to anyone in the queue and ask \"what song are you dying to hear tonight?\" and suddenly we're friends. Queue friendships are temporary but they're real. The show that changed everything was seeing Bladee, Ecco2k, and Thaiboy together in Stockholm for Rift Festival, September 2022. Old warehouse venue, perfect light show, crowd energy was unreal. They opened with Western Union and I have a video where you can see my camera fly around because the crowd went so wild I couldn't hold my hand still.",
  concertsHeading: 'Recent Concerts',
  concertsIntro:
    "Sometimes I go with friends, sometimes solo. Both are fun honestly. When I'm alone I usually start chatting with someone right when I get in line. Headphones are in 24/7 when I'm outside anyway so concerts are just the natural extension of that I guess.",
};

export const photographyContent = {
  heading: 'Photography',
  intro:
    "I was going to a conference in SF so I stopped over in NYC for 8 days. Ended up way more excited about the stopover than the actual trip. First time with my camera, running around Central Park like a kid. I don't plan shots, I just shoot. Framing something good brings instant dopamine. Headphones in, music on, just walking and looking.",
  subjects:
    "I mostly shoot architecture and street. People stress me out. It's the pressure of getting it right, you know? I'd love to get into portraits eventually but not there yet.",
  favoriteShotLabel: 'Favorite shot',
  favoriteShot:
    "Rio, January 2025. I only stayed one night because I was scared of being there alone. My friend stayed in Paraguay and I flew back solo. Immediately regretted it. Turned out Rio is amazing and I should've stayed longer. Would love to go back.",
  processLabel: 'Process Notes',
  process:
    'SOOC (straight out of camera) using Fuji film simulation recipes. Started with Portra 160, now mostly shooting Portra do Sol. Committing to the image in-camera, no post-processing.',
  galleryUrl: 'https://photography.mislavjc.com',
};

export const codeContent = {
  heading: 'Code',
  origin:
    'It started during lockdown. First HTML & CSS class on Microsoft Teams, and something just clicked. I spent days locked in my room watching Udemy courses, building barebones CRUD apps with Express and EJS. Two people I owe my career to: my professor who introduced me to it, and Colt Steele whose course got me through those early days.',
  now: "Now coding is my craft, my safe place. Half my side projects are Spotify-based. I'm not a musician but making things with music is what I love. stamped.today is the current one: you collect stamps of artists you love, frozen with their monthly listener count at that moment. Proof you were a day 1 before they blew up.",
};

export const travelContent = {
  heading: 'Travel',
  intro:
    "I don't know what it is but there's something freeing about being somewhere new. Doesn't have to be far either, even just crossing to Ljubljana does it. I just like wandering around with no plan, getting lost in neighborhoods. And this is weird but I love checking out stores in foreign countries. You learn so much about a place from them. The Spätis in Berlin where you grab a euro beer and sit by the river, bodegas in NYC, meal deals in the UK.",
  berlin:
    "Berlin is probably my favorite place in Europe. It's rough compared to somewhere like Hamburg, but every neighborhood feels like its own world. Kreuzberg, Prenzlauer Berg, completely different vibes. I keep going back partly for the city but honestly mostly for Heimweh. My friends are so tired of hearing about it but the kumpir there is unreal. The portion is massive, you need to show up starving and even then you might not finish it.",
  kumpir:
    "Last time I went I was staying in Hamburg but took a Flixtrain just for a day trip. I'd been at the bunker club until 5am, train was at 7, felt like a zombie until I got there. But that kumpir was the mission and it delivered. Trying to finish all 45 European countries by end of next year. 15 left, god bless Ryanair.",
  passportHeading: 'Passport',
  passportIntro: "My passport is a mess but here's a cleaner version.",
};
