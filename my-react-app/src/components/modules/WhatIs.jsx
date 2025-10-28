export function WhatIsReact() {
  return (
    <div>
      <h1>리액트란?</h1>

      <pre>
        UI(User Interface)를 구현하기 위한 JavaScript Library
        <br />
        자바스크립트 코드를 작성 코드의 단위를 Component로 구분함.
        <br />
        Component를 조합하여 복잡한 UI를 구성할 수 있음
        <br />
        SPA(Single Page Application)을 구현하기 위한 도구로 사용함!
        <strong>
          화면을 예쁘게 만드는 것과 React는 전~~혀 연관이 없음
        </strong>
        <br />
        리액트를 학습하기 위해서 Node.js라는 JavaScript Runtime을 설치
        <br />
        NPM(Node Package Manager)라는 패키지 매니저 + JSX(Babel)문법을 활용하여
        학습할 예정
      </pre>
    </div>
  )

}

export const WhatIsJSX = () => {
  return (
  <>
    <h2>JSX란 무엇인가?</h2>

    <pre>
      JSX(JavaScript XML)는 JavaScript + XML을 사용한 자바스크립트 문법
      <br />
      리액트 요소 만드는 법 : React.createElement('h1', null, 'Hello~') <br />
      JSX 문법으로 리액트 요소 만들기 : <h1>Hello~</h1> <br />
      JSX문법을 사용해서 JavaScript코드 내부에서 react의 "Element"를 생성할 수 있음.
      JavaScript의 모든 기능을 이용할 수 있음 + UI를 생성할 때 React랑 같이 쓰라고 권장함.
      <br />
      ReactElement란?
      <br />
      Component를 구성하는 요소 <br />
      화면에 만들어내고 싶은 요소를 작성해서 React가 브라우저에 랜더링할 수 있게 해준다.
      <br />
      특징 : 불변객체
      <br />
      React는 index.html안에 있는 아이디 속성값이 root인 div요소 안에서 모든
      요소를 관리
      <br />
      main.jsx에서 root.render()를 호출해서 element를 전달
      <br />
      React를 이용해서 UI를 변경하는 방법은 ReactElement를 만들어서
      root.render()의 인자값으로 전달하는 방법뿐!!!!!!!!
    </pre>
  </>
  )
}

