// @ts-nocheck
import "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\management\\practitioners\\page.tsx";
import "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\management\\layout.tsx";
import "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\layout.tsx";
import "next/dist/client/components/not-found-error";"TURBOPACK { transition: next-ssr }";
import { AppPageRouteModule } from "next/dist/server/future/route-modules/app-page/module.compiled";
import { RouteKind } from "next/dist/server/future/route-kind";
// We inject the tree and pages here so that we can use them in the route
// module.
const tree = {
        children: [
        '',
        {
        children: [
        'management',
        {
        children: [
        'practitioners',
        {
        children: ['__PAGE__', {}, {
          page: [() => import(/* webpackMode: "eager" */ "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\management\\practitioners\\page.tsx"), "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\management\\practitioners\\page.tsx"],
          
        }]
      },
        {
        
        
      }
      ]
      },
        {
        'layout': [() => import(/* webpackMode: "eager" */ "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\management\\layout.tsx"), "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\management\\layout.tsx"],
        
      }
      ]
      },
        {
        'layout': [() => import(/* webpackMode: "eager" */ "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\layout.tsx"), "C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\layout.tsx"],
'not-found': [() => import(/* webpackMode: "eager" */ "next/dist/client/components/not-found-error"), "next/dist/client/components/not-found-error"],
        
      }
      ]
      }.children;
const pages = ["C:\\Users\\MSI PRESTIGE 15\\Documents\\VS Code\\Software Development\\Aurelia Private Clinic\\app\\management\\practitioners\\page.tsx"];
export { tree, pages };
export { default as GlobalError } from "next/dist/client/components/error-boundary";
const __next_app_require__ = __webpack_require__
const __next_app_load_chunk__ = () => Promise.resolve()
export const originalPathname = "/management/practitioners/page";
export const __next_app__ = {
    require: __next_app_require__,
    loadChunk: __next_app_load_chunk__
};
export * from "next/dist/server/app-render/entry-base";
// Create and export the route module that will be consumed.
export const routeModule = new AppPageRouteModule({
    definition: {
        kind: RouteKind.APP_PAGE,
        page: "/management/practitioners/page",
        pathname: "/management/practitioners",
        // The following aren't used in production.
        bundlePath: "",
        filename: "",
        appPaths: []
    },
    userland: {
        loaderTree: tree
    }
});

//# sourceMappingURL=app-page.js.map