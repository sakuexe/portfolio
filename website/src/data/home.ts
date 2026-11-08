// Content for the front page sections. Rich text is plain HTML (rendered with set:html).
import type { ImageMetadata } from "astro";
import type { SvgComponent } from "astro/types";

import linuxIcon from "@/assets/icons/expertise/linux-svgrepo-com.svg";
import javascriptIcon from "@/assets/icons/skills/javascript_logo.svg";
import csharpIcon from "@/assets/icons/skills/csharp_logo.svg";
import goIcon from "@/assets/icons/skills/go_logo_blue.svg";
import pythonIcon from "@/assets/icons/skills/python_logo.png";
import figmaIcon from "@/assets/icons/skills/figma_logo.svg";
import nixIcon from "@/assets/icons/skills/nix-snowflake-colours.svg";

export type Link = { title: string; url: string };

export const site = {
  seo: {
    description: "The portfolio website of Saku Karttunen, a fullstack software engineer from Finland",
    keywords: ["portfolio", "fullstack developer", "software engineer", "finland", "freelancer"],
  },
};

export const aboutMe = {
  heading: "Who am I?",
  description: `<p>Hello there, I am Saku and I am a fullstack web and software engineer from Finland. I have a passion for creating and I enjoy solving problems with code. I also like tinkering with Linux and docker in my projects. You can find me in the terminal. If you have any questions, feel free to get in contact from the form below. (Or from the provided social links).</p>
<p>Thank you for visiting! If you have any further questions or would like to work with me, feel free to contact me through the <a href="#contact-form">form</a> below, by <a class="email" href="mailto:saku.karttunen@proton.me">email</a> or through my social media <a href="#contact-info">listed below</a>.</p>`,
  cvUrl: "/files/saku-cv.pdf",
};

/** `icon` is an SVG import (inlined). Without one, the SK logo is used. */
export const expertise: {
  heading: string;
  cards: { heading: string; description: string; icon?: SvgComponent }[];
} = {
  heading: "What do I do?",
  cards: [
    {
      heading: "Fullstack Software Development",
      description: "Passion towards Software and Web Development. I love to work on both Frontend and Backend. Experience working with many different frameworks and languages",
    },
    {
      heading: "System Administration",
      description: "Experience working on Linux servers as well as desktop environments. I really enjoy automating and maintaining these systems. (NixOS mentioned)",
      icon: linuxIcon,
    },
    {
      heading: "UI/UX Design",
      description: "Professional background working on Graphic Design has built a strong foundation for UI/UX Design. Experience with Adobe Software and Figma.",
    },
  ],
};

/** Badge `icon` is an SVG import (inlined) or a raster image import. */
export const skills: {
  heading: string;
  description: string;
  bars: { label: string; value: number }[];
  badges: { label: string; icon: SvgComponent | ImageMetadata }[];
} = {
  heading: "My Skills & Tools",
  description: `<p>Here is a list of some of the skills I have aquired along the way. I have intended this list to be somewhat of a represantation of my confidence level in working with each of these technologies.</p>
<p>Do not look too deeply into the values, as they are just a rough estimate of how I am feeling currently with them.</p>`,
  bars: [
    { label: "Frontend development", value: 85 },
    { label: "Backend Development", value: 75 },
    { label: "Design", value: 60 },
  ],
  badges: [
    { label: "Javascript", icon: javascriptIcon },
    { label: ".NET/C#", icon: csharpIcon },
    { label: "Go", icon: goIcon },
    { label: "Python", icon: pythonIcon },
    { label: "Design Software", icon: figmaIcon },
    { label: "Linux", icon: nixIcon },
  ],
};

export const projects = {
  heading: "My Portfolio",
  /** Slug of a project in the `projects` collection. Falls back to a random one. */
  featured: "taurudesign" as string | undefined,
  filterableCategories: ["Web Development", "Graphic Design"],
};

export const experiences = {
  heading: "Professional background",
  description: `<p>Here is a list of my prior professional experiences. This includes many different types of jobs and fields. I am willing to talk more about these if you are interested, so remember to ask!</p>`,
};

export const contact: {
  heading: string;
  description: string;
  emailAddress: string;
  links: Link[];
} = {
  heading: "Looking For a Developer?",
  description: `<p>Are you in need of a developer for an upcoming project? Or are you looking for someone to bring your software/website plans to fruition? Get in touch with me and let’s work together to make sure your project becomes the way you would want.</p>
<p>Get in contact with me through any of the links below or via the contact form. Or shoot me a message through email.</p>`,
  emailAddress: "saku.karttunen@proton.me",
  links: [
    { title: "Github", url: "https://github.com/sakuexe?tab=repositories" },
    { title: "Instagram", url: "https://www.instagram.com/saku.karttunen/" },
    { title: "Linkedin", url: "https://www.linkedin.com/in/sakukarttunen/" },
  ],
};
