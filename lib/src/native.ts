import { Page } from "tns-core-modules/ui/page";
import { Frame } from "tns-core-modules/ui/frame";
import { run } from "tns-core-modules/application";
import { sinkFuture } from "@funkia/hareactive";
import { Component } from "@funkia/turbine/dist/cmjs/component";

export function runComponent<A>(component: any) {
  let pageFn;
  const fakeframe = <Frame>{
    navigate: function(fn: () => Page) {
      pageFn = fn;
    }
  };
  component.run(fakeframe);
  run({ create: pageFn });
}

export function testComponent<O, A>(
  component: Component<O, A>
): {
  out: A;
  page: Page;
  explicit: O;
  destroy: (toplevel: boolean) => void;
} {
  const page = new Page();
  const destroyed = sinkFuture<boolean>();
  const { output: out, explicit } = component.run(page as any, destroyed);
  const destroy = destroyed.resolve.bind(destroyed);
  return { out, explicit, page, destroy };
}
