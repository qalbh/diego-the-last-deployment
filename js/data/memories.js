// Memory Wall content (shown after the Diego Succession Plan at the end of Level 5).
//
// The team's real farewell messages, as they sent them (Slack emoji codes turned
// into emoji, timestamps removed). Format inside `text`:
//   a blank line starts a new paragraph, "## " starts a heading, "- " starts a bullet.
// `photo` is a key in PHOTOS (js/data/photos.js); people without one get initials.
// `highlight` is a short line taken word for word from the message, shown on the note.
// Leave `role` empty when unsure rather than guessing.
const MEMORIES={
 photos:[
  {src:'assets/memories/web/dubai-yacht.jpg',caption:'Dubai Marina: yacht day ⛵'},
  {src:'assets/memories/web/zack-diego.jpg',caption:'Zack & Diego (and one very fluffy colleague) 🐕'},
  {src:'assets/memories/web/dubai-desert.jpg',caption:'The desert crew 🏜️'},
  {src:'assets/memories/web/dubai-yacht-2.jpg',caption:'Dubai Marina, take two 🛥️'}
 ],
 messages:[
  {name:'Zack Morrison',role:'CTO',photo:'zack',
   highlight:'it’s been a privilege to have you as a teammate and a friend.',
   text:`## Diego’s Funniest Moments
- The time he tried to outsmart us by running a looped video of himself on Zoom so we’d think he was paying attention
- Working side by side at the WeWork in Lima and enjoying amazing Peruvian food
- Getting through flood conditions and sailing on yachts together in Dubai
## His Contributions and Memorable Fixes
- Squashing bugs at 35,000 feet, from airplane seats around the world
- Endless proofs of concept, including using AI to streamline his work long before AI was mainstream
- The Brij Robotics simulator, using AI to navigate virtual worlds
- Building a virtual office where the engineering team could hang out together
## A Final Personal Message
Diego, it’s been an amazing ride with you over the past few years. I’ll always remember your endless enthusiasm and love for technology, your creativity, and your can-do entrepreneurial attitude. From long working sessions on Zoom to in-person hangouts across the globe, from New York to Dubai to Peru, it’s been a privilege to have you as a teammate and a friend. I wish you the best of luck with your new venture, and I know you’ll succeed wherever it takes you.`},
  {name:'Kait Stephens',role:'',photo:null,
   highlight:'We are cheering you on!',
   text:`Hi Diego,

You are going to be so missed at Brij. It’s been such a pleasure having you on the team. A couple of memorable moments: when you and your wife came to NYC around the holidays and we had holiday cocktails, I just remember you being in a perfect ugly Christmas sweater. Then when you visited around the World Cup, we made those ridiculous content videos of you and Gui pretending to work but really watching the World Cup. 😂

I will miss those funny moments but couldn’t be happier for you to kick off your entrepreneurial journey... it is the truest expression of our core value of being an entrepreneur.

We are cheering you on!

Kait`},
  {name:'Haris',role:'Program Manager',photo:'haris',
   highlight:'you dancing Bhangra on the yacht with all of us despite having no idea what the Punjabi lyrics meant!',
   text:`@Diego Silva it’s tough to see you go! Working with you has been a great experience, not just because of your dedication and the key contributions you made to the team, but because of the positivity you brought every single day.

Whenever I think of our time together, I’ll smile remembering our trip to Dubai—especially you dancing Bhangra on the yacht with all of us despite having no idea what the Punjabi lyrics meant! You’re a genuinely wonderful person, and any team will be lucky to have you.

Wishing you the very best of luck on your new journey ♥️`},
  {name:'Eren Yar',role:'Project Manager',photo:'eren',
   highlight:'You proceeded to design the ugliest windows 3.1 button possible and said “it’s a button”.',
   text:`Diego, my favorite memory is when I gave you a ticket for a download button on the receipt page in BD without a mockup. I pointed to where to put it but didn’t design the button shape, just said something like “it’s a button, I think you can handle it”. You proceeded to design the ugliest windows 3.1 button possible and said “it’s a button”. It won’t be the same here without you! You made a lot of hard things fun, we’ll miss you. Stay in touch, and good luck Diego!`},
  {name:'Jake',role:'Project Manager',photo:'jake',
   highlight:'always quick to compliment others on their hard work.',
   text:`Diego was one of the first people at spoke to at Brij and he was as kind and helpful in my first week as he has been during his final week. The list of domain, database, architecture and rebates solutions he has worked on would take forever to discuss, but I will remember him most as someone who was always fun to work alongside and who was always quick to compliment others on their hard work.`},
  {name:'Zoofi',role:'Lead QA',photo:'zoofi',
   highlight:'The funniest part was that you were actually still in the meeting, just hiding while we watched fake Diego!',
   text:`Diegooo!

I genuinely can’t believe you’re leaving Brij! It’s been such a pleasure working with you, from all the bugs I’ve thrown your way to the countless fixes you’ve worked on. You’ve always been so kind, patient, and just an amazing person to work with.

Some of my favorite memories are definitely when you were lying down, hiding from the camera, while a video of you played on loop as your Zoom background. 😂 The funniest part was that you were actually still in the meeting, just hiding while we watched fake Diego! And of course, I’ll never forget the trivia game you schemed up where every single answer Sush gave was wrong, even when it was correct. That was amazing!

But jokes aside, Diego, you’re genuinely such a wonderful person. You’re one of those people who make working together feel easy and enjoyable. You’ve always been so approachable, thoughtful, and willing to help, and I really appreciate that. I hope you know how much of a positive impact you’ve had on the team, me and how much you’ll be missed.

I’m genuinely sad to see you go, but I’m also so happy and excited for whatever life has planned for you next. You deserve all the amazing things coming your way, both professionally and personally. I hope you always stay the kind, funny, and wonderful person that you are

Thank you for everything, Diego. For all the help, the patience, the laughs, and the memories. Brij won’t feel quite the same without you. ❤️

Wishing you all the happiness and success in the world.`},
  {name:'Arqam',role:'Developer',photo:'arqam',
   highlight:'I literally started traveling because of you and it led me to explore over a dozen countries.',
   text:`I still remember when you were new and I saw you moving your cursor around aimlessly in FigJam. I gossiped to my team, “Diego is just following my cursor around xD”, except I sent it in our main brij-engineering channel by mistake. It was so embarrassing. I assumed you saw it and I avoided eye contact with you for a few days. 😅

Then a few days later I got to work with you on a task, and I immediately told Zack and Sush that Diego is a delight to work with. Ever since then I’ve always been keen to collaborate with you on features. You’re truly the best when it comes to team play, your out of the box thinking is something we all get inspired by.

I also used to see you traveling all over, and it inspired me so much that I literally started traveling because of you and it led me to explore over a dozen countries.

You’ll truly be missed. I learned a lot from you, not just professionally, but as a person too.

Wishing you the best of luck and lots of success, now and in the foreseeable future.`},
  {name:'Alina',role:'',photo:null,
   highlight:'Thank you for always answering “hey Diego, quick question 👀” with patience and a fix.',
   text:`Diego, working with you has been a real pleasure. Thank you for your support, your humor, and for making QA and dev feel like one team.

From rebate flows and V3 custom domains to saving brands from printing the wrong QR codes, you’ve done so much here. Thank you for always answering “hey Diego, quick question 👀” with patience and a fix.

I’ll never forget you joining our QA channel “for memes” and thanking us in Arabic, Urdu AND Hindi 😂, or how beautifully you say “Assalam o Alaikum” 🤍. I’ll miss your Slack wisdom too: “Prod is the new staging,” the monkey who stole your Coca Cola 🐒, and your nonstop Klindi pitch 😬.

All the best, Diego! 🚀`},
  {name:'Maryam',role:'',photo:null,
   highlight:'you joined our meeting and greeted us with “Assalam-o-Alaikum!” and Hello Maryam 😂',
   text:`## Funniest Moment
One of my funniest memories will always be when you joined our meeting and greeted us with “Assalam-o-Alaikum!” and Hello Maryam 😂 It was such a small but unexpected moment that definitely made us smile and will always be memorable!
## Contributions & Memorable Fixes
Your contributions to Brij over the years have been truly remarkable. From building custom domains from scratch to working on rebates, fraud detection, V3, infrastructure improvements, and some of the biggest launches, your impact can be seen across so many parts of Brij.

Your creativity, unique problem-solving approach, technical expertise, and willingness to take on challenges have made a huge difference. You’ve not only helped build and improve the product but also left your footprint across the team’s engineering culture. Your contributions will definitely be remembered!
## Personal Message
Beyond all your technical contributions, what makes you special is your helpful nature, positive attitude, and the way you make working together enjoyable. You’ve left a lasting mark not just on the product but also on the people you’ve worked with.

Wishing you all the very best for your next chapter, Diego! You’ll definitely be missed. Good luck with everything ahead, and I hope our paths cross again! ❤️`},
  {name:'Hamza',role:'',photo:null,
   highlight:'Diego said “turning it on!”, and a few minutes later you showed up with perfect hair',
   text:`Many things we can’t forget, but the funniest was the morning Diego joined a call half asleep. Zack asked for cameras, Diego said “turning it on!”, and a few minutes later you showed up with perfect hair, pretending totally fresh and okay. . 😆

Thanks for the fixes, the help, and the laughs. We’ll miss you. Good luck.`},
  {name:'Erick',role:'',photo:null,
   highlight:'Diego my hommie, who am I gonna speak spanish to now 😞',
   text:`Diego my hommie, who am I gonna speak spanish to now 😞

Diego is top 3 of the people that make you feel welcomed and also top 3 people who always jumps to help when you need him

Without Diego Rebates automation would have been an absolute pain

I look up to you Diego, I hope things work out for you and your startup ideas, you’ll be missed`},
  {name:'Aamir Amin',role:'',photo:null,
   highlight:'a great engineer who understands systems deeply, and above all, a genuinely kind person.',
   text:`It was really nice working with you, Diego! Although we didn’t get to work together for very long, I really enjoyed our collaboration, especially on the consumer app security fixes. I always found you to be a great engineer who understands systems deeply, and above all, a genuinely kind person. Wishing you all the best for what’s ahead. It was a pleasure working with you!`},
  {name:'Arielle',role:'',photo:null,
   highlight:'I’m excited to see what you build and will be cheering you on!!',
   text:`Diego! It’s been so great working with you, and I’m so glad you made it to NYC so we could all meet in person! Thank you for all your help with GTM engineering. I’m excited to see what you build and will be cheering you on!!`},
  {name:'Qalb',role:'Design · maker of this game',photo:null,
   highlight:'A farewell card felt too small for you, so I built you a whole game instead.',
   text:`Diego,

Designers don’t always get lucky with the developers they hand their work to. I got lucky with you. You never treated a design as “just a mockup”: you cared about how things looked and felt, you asked the right questions, and working with you never felt like design on one side and engineering on the other. It felt like one team, building something together and having fun doing it.

A farewell card felt too small for you, so I built you a whole game instead. Every level is a little thank you, every boss is someone who is going to miss you, and yes, I made sure you escape at the end. 😄

Go build something amazing with your new venture. I hope it looks as good as it works, and if it ever needs a designer, you know where to find me.

Thank you for everything, Diego. You will be missed! 💜

Qalb`}
 ]
};
