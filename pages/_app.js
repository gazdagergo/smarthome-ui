import App, { Container } from "next/app";
import Head from "next/head";
import styled, { createGlobalStyle } from "styled-components";
import { title } from "./_document";

// Any global CSS variables and selectors we want
const GlobalStyle = createGlobalStyle`
  :root {
    --padding: 2rem;
    --max-width: 50rem;
  }

  body {
    background: black;
    font-family: 'PT Sans', sans-serif;
    margin: 0;
  }
`;

const Main = styled.main`
  margin: 0 auto;
  max-width: var(--max-width);
  /* padding: var(--padding); */
  height: 100vh;
  color: lightgray;
`;

export default class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps, router } = this.props;

    return (
      <>
        <Head>
          <title>{title}</title>
        </Head>
        <Container>
          <Main>
            <Component {...pageProps} router={router} />
          </Main>
          <GlobalStyle />
        </Container>
      </>
    );
  }
}
