import Button from "./Button";
import Heading from "./Heading";
import Section from "./Section";
import Tagline from "./Tagline";
import { roadmap } from "../constants";
import { check2, grid, loading1 } from "../assets";
import { Gradient } from "./design/Roadmap";
import linkedin from "../assets/linkedin.png";

const Roadmap = () => (
  <Section className="overflow-hidden" id="roadmap">
    <div className="container md:pb-10">
      <Heading tag="and now finally.." title="Meet the Devs" />

      <div className="relative grid gap-6 md:grid-cols-2 md:gap-4 md:pb-[7rem]">
        {roadmap.map((item) => {
          // const status = item.status === "done" ? "Done" : "In progress";

          return (
            <div
              className={`md:flex even:md:translate-y-[7rem] p-0.25 rounded-[2.5rem] ${
                item.colorful ? "bg-conic-gradient" : "bg-n-6"
              }`}
              key={item.id}
            >
              <div className="relative w-full bg-n-8 rounded-[2.4375rem] overflow-hidden p-10">
                <div className="absolute inset-0 z-0 w-full h-full">
                  <img
                    className="w-full h-full object-cover rounded-full "
                    src={grid}
                    // width={550}
                    // height={550}
                    alt="Grid"
                  />
                </div>
                <div className="relative z-1">
                  <div className="flex items-center justify-between max-w-[27rem] mb-8 md:mb-20">
                    <Tagline>
                      <a
                        href={item.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <img
                          className="w-10 h-10"
                          src={linkedin}
                          alt="LinkedIn"
                        />
                      </a>
                    </Tagline>

                    {/* <div className="flex items-center px-4 py-1 bg-n-1 rounded text-n-8">
                      <img
                        className="mr-2.5"
                        src={item.status === "done" ? check2 : loading1}
                        width={16}
                        height={16}
                        alt={status}
                      />
                      <div className="tagline">{status}</div>
                    </div> */}
                  </div>

                  <div className="mb-2 -my-30 -mx-15">
                    <div className="relative w-full  h-full flex justify-center intems-center">
                      <img
                        className="w-[45%] -mt-15 mb-7 rounded-xl border-2 border-white-500"
                        src={item.imageUrl}
                        width={628}
                        height={426}
                        alt={item.title}
                      />
                    </div>
                  </div>
                  <h4 className="h4">{item.title}</h4>
                  <p className="body-2 text-n-4">{item.text}</p>
                </div>
              </div>
            </div>
          );
        })}

        <Gradient />
      </div>

      <div className="flex justify-center mt-12 md:mt-15 xl:mt-20">
        <Button href="/roadmap">Our roadmap</Button>
      </div>
    </div>
  </Section>
);

export default Roadmap;
