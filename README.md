# React-Godfather

"Look ma, no Hooks!"

**React-Godfather aims to explore an alternative mental model for functional components.**
It adds a thin layer between your shiny components and React, quietly instrumenting things behind the scenes - 
and it wants to make you an offer you can't refuse.

Here is what you get:

* A very natural, top-down local state management which does **not** feel like a DSL...
* ... and plays great with your existing code - you can progressively adopt it in your code-bases.
* Fully Asynchronous components to `await` all you want, even within the render function...
* ...that also supports async generators, for all your `yield`ing extravaganzas.
* Code-splitting without wrapping.
* Wings for your junior team colleagues.

## Index

* [How does a component look like?](#can-you-tell-what-this-does)
* [The basic characteristics of a component](#lets-unpack-it)
* [Structure, State & Render](#structure-state-and-render)
* Understanding Rendering  
    * [Explicit re-render](#tick-toc)
    * [Implicit re-rendering](#implicit-tick)
* Component Props
    * [A tale of two cities](#what-about-props)
    * [Gotcha!](#heres-a-gotcha-props-example)
    * [Getting it right](#heres-the-prop-er-pun-intended-version)
* [Nesting Components](#nesting-components) 
    * [Will my kitchen blow up if I overdo it?](#would-the-known-universe-collapse-)
    * [But does it run Crysis?](#whoa-whoa-wait-a-minute)
* [Events tracked by default](#le-default-event-list)
* [Async / Promises](#async--promises)
    * [Elementary, my dear Watson](#its-pretty-straightforward)
    * [CodeSplitting, for free](#code-splitting)
    * [A simple pattern](#what-about-an-error-message-on-failure-to-import)
    * [This won't work](#what-about-a-message-while-it-awaits)
    * [But it would work like this](#we-can-do-it-in-a-cleaner-way)
    * [And it definitely works great like this!](#naturally-we-can-do-much-better)
    * [How to move explicit ticks out of view](#any-alternative-style-for-thentick)
* [Async Generators](#async-generators)
* [Component Cleanup](#cleanup-function) 
* [Code Examples](#code-examples)
    * [StoryBook](#storybook)
    * [CodeSandbox](#codesandbox)
* [What is under the hood?](#how-does-this-magic-work)
* [Usage & understanding the configuration](#usage--understanding-the-configuration)
* [FAQ](#faq)
    * [But why?](#but-why)
    * [What about speed? Is it perhaps slow?](#what-about-speed-isnt-checking-for-deep-equality-slow)
    * [Is this still a functional component?](#is-it-still-really-a-functional-component)
* [License](#license)    


## Preamble

React-Godfather is straightforward, easy but different. 

Considering that it's a newborn idea which is very different from our usual practice, 
dryly listing the differences and features does not seem like the most helpful way to go about it.
Instead, I've opted to construct this Readme with examples and discuss them in a step by step way. 
I have tried to keep the narrative style very informal, as if we were drinking coffee together and chatting. 

This way, I hope that everything will make perfect sense in the end, without the reader expanding any serious effort. 
So please [bear](https://imgur.com/t/bear/SBhKxUd) with me.

There are links to live playgrounds for each example. 
Furthermore, this repo contains Storybook examples for you to examine and play with.
To use the Storybook, clone the repo, npm/yarn install and yarn start.

Alright, let's start!

## Can you tell what this does?

*(You can play with the example [here](https://codesandbox.io/s/react-godfather-docs-demo-1-dco9i) - 
press the button a few times for fun)*

```javascript
const App = () => {
  let remoteData, error

  const fetchData = async () => {
    try {
      // `dummyResponse` mocks a call that fails randomly
      remoteData = await dummyResponse()
      error = false
    } catch (e) {
      error = true
    }
  }

  return ({ tick }) => {
    if (error) {
      return (
        <div>
          <p>Something went wrong. Ray-id: {Math.random()}</p>
          <button onClick={fetchData}>Re-try</button>
        </div>
      )
    }

    if (!remoteData) {
      fetchData().then(tick)

      return <div>Loading...</div>
    }

    return (
      <div>
        <p>
          Received: {remoteData}. Ray-id: {Math.random()}
        </p>
        <button onClick={fetchData}>Fetch again</button>
      </div>
    )
  }
}

export default toC(App, ['onClick'])
```

Of course you can! That's one of `react-godfather`'s main goals. 
The top-down "reading" of the code makes it natural to reason with it.


## Let's unpack it.

React-godfather components have some differences from the standard React functional components.

<img src="https://github.com/kapolos/react-godfather/blob/main/docs/screenshots/scribble1-unpacked.jpg?raw=true" width="560" alt="scribble1">

In this specific example, `remoteData` and `error` hold our local state. They are defined (along with the `fetchData`
function) above the component's `return` call. Everything in this section of the component is executed once and stays
along for the whole lifetime of the component - in other words, variables here survive across re-renders.

### Structure, State and Render

As we've seen, the component consists of 2 sections. The first one is everything before the return statement. 
This part **only executes once** and the state here is kept **across re-renders**.
In the old React Class terms, we can think of it as the equivalent of field declaration, `state` and the constructor, all bundled together.

The second section lies within the component's return function. 
Notice that we return a function and not directly JSX (which it itself is a function, but still, you get the idea).

This function executes **on every render** and **has access to everything declared on the first section**. 
It can be `async` if we want (we'll see an example later on). 
If we again think in terms of the old React Class, this would be the `render` function.

Therefore, **the role of the first section is to act as the mutable state container for our "render" function**.

### Tick ToC

A React-godfather component needs something to drive it and eventually output a standard React component. 
After all, we are still relying on React (which is awesome, btw), so we need to play ball with it. 
For this, a wrapper is used, which I have _\*cough\*_ imaginatively _\*cough\*_ named "to Component",
or just `toC` for friends.

ToC adds some extras to the component's `props`. That's where `tick` comes from.
Tick is responsible to advance the state (detailed explanation follows - surprise - later on) and materialize the changes.
Basically, `tick` advances the internal state of `toC` and re-renders the component.

### Implicit Tick

But wait! If I have to `tick` to advance the state, why did it just work when clicking the button? 

Naturally, it's because laziness precedes reward.

We don't really want to be manually typing `tick` all over the place, especially when it comes to 
handling `onX` events which is a very common thing in the daily coding life.
Therefore, `toC` can be configured to detect the `onX` events and advance its state on its own. Yay!

(In case you're worried that typing that `['onClick']` is too labor intensive, we're not done lazying yet - 
wait till we get there.)

## What about props?

We talked about react-godfather components having two parts. One that executes on initialization,
and the other the executes on every render.

Props get passed in both places, like this:

```js
const Foo = toC((initialProps) => {
  let { bar } = initialProps
  
  return (props) => {
    bar = props.bar
    
    return <div>{bar}</div>
  }
})
```

The `props` hold the up-to-date value for the render. 
But `initialProps` always hold the value as they were at the time of initialization!

### Here's a gotcha props example

(**[playground link](https://codesandbox.io/s/react-godfather-docs-demo-2a-f7947)**)

```js
// Just a form with a controllable text input component
const InputForm = toC(() => {
  let value = "foo";

  const handleOnChange = (e) => {
    value = e.target.value;
  };

  return () => (
          <form spellCheck={false}>
            <div style={{ color: "blue" }}>{value}</div>
            <InputWithInitialPropsValue value={value} handleOnChange={handleOnChange} />
          </form>
  );
}, ["onChange"]);

// Frodo was here
const InputWithInitialPropsValue = toC(({ value, handleOnChange }) => {
  return () => (
          <input
                  type='text'
                  className='input'
                  value={value}
                  onChange={handleOnChange}
          />
  )
}, ['onChange'])
```

What's the problem here? As we type keys, the `handleOnChange` function always concatenates the key with `foo`. 
So if we press `t`, we get `food` and it we then press `s` we are still left with a `food` instead of `foods` because the `value` that
`InputWithInitialPropsValue` sees on every render is always `foo` - the value that at the time of its initialization.

### Here's the prop-er (pun intended) version

**[playground link](https://codesandbox.io/s/react-godfather-docs-demo-2b-lzgs0)**

```js
const InputFixed = toC(({ handleOnChange }) => {
  return ({ value }) => (
          <input
                  type='text'
                  className='input'
                  value={value}
                  onChange={handleOnChange}
          />
  )
}, ['onChange'])
```

There we go! The input behaves properly as we type, because we ask for the updated `value` on each render.
The rule of thumb is "when in doubt, use the render props". Or just always use the render props anyway.

## Nesting components

Another thing of notice in the form above was that we had two react-godfather components, one nested into the other. 
Let us revisit this with the following - very contrived - example. 
This is a voting booth with two buttons, and you may vote either yes or no.
And because we don't care enough in the context of the example, 
there's no way to cast your vote, so you just end up playing with the buttons. 
But rejoice, for you can press the buttons as many times as you like and it will happily keep track of your madness
during this ...regression hypnosis session. But I digress...

The key here is that we have 2 react-godfather components (one nested in the other) and 
we want to see another aspect of how they interact.

```js
// This Button keeps track on how many times it was hit in its local state
const Button = toC(({ label, submit }) => {
  let hits = 0

  const handleClick = () => {
    hits++
    submit(label)
  }

  return ({ vote }) => (
    <div>
      <p>You've hit {label} {hits} times</p>
      <button
        onClick={handleClick}
        disabled={vote === label}
      >{label}
      </button>
    </div>
  )
}, [])

// The Booth does not keep track of the button hits, only the value of the vote
const Booth = toC(() => {
  let vote

  const handleButton = label => {
    vote = label
  }

  return () => (
    <div>
      <p>Current vote is: {vote}</p>

      <Button label='yes' submit={handleButton} vote={vote} />
      <Button label='no' submit={handleButton} vote={vote} />
    </div>
  )
}, ['onClick'])
```

The `Booth` component passes 3 things to the `Button` component:
* `label`: yes or no
* `vote`: the current vote: yes, no, null
* `handleButton`: the imaginatively named function to update `vote`'s value to whichever button you clicked.

The `Button` component counts the times you've clicked it in the `hits` local state variable. 
It gets disabled if the current vote is the same as the button's.

**[vote here](https://codesandbox.io/s/react-godfather-docs-demo-3-ggefk)

### Did we forget something?

Wait, why is ['onClick'] missing from the button's `toC` parameters?

We talked about how `toC` can do work for us and detect `onX` events and update its state. 
So how come `Button` works despite us telling it to disregard monitoring for events?

That's because of the `handleButton` function. Remember that it executes on the scope of `Booth`, 
hence it changes `Booth`'s state.

Ok, `Booth`'s state has changed, but what triggers **its** rerender? 
The `['onClick']` we have on its `toC` instantiation (last line in the code snippet above).

Recall that DOM (and React's synthetic) events bubble UPwards in the hierarchy tree! We will cover this in detail in 
the "What is under the hood?" section but for now the important thing is that the click event bubbled 
from `Button` into `Booth`. And `Booth` is configured to rerender when an ['onClick'] happens.

Since `Booth` re-renders and `vote` has changed, the `Button` components re-renders as well. 
That's because `react-godfather` **components rerender when their props change**.

### Would the known Universe collapse ...
...in case we added `['onClick']` on `Button`?

Nope, no problem at all. You'll just get an extra re-render of that `Button` instance. That's all.

### Whoa, whoa, wait a minute! 

**Q:**

Say I have 50 react-godfather components in a deeply nested way, and the one at the very top is set to react `onClick`. 
And suppose the one at the bottom emits a click event,
but that event doesn't really matter for the state of the components at the top. 
Will the whole sub-tree still get re-rendered?

**A:**

Well, we could go on  a tangent about React being fast and memoization and stuff,
but I bet it still feels a bit uncomfortable, no? 

**No worries!** You can optimize this away whenever you feel like it.

`toC` accepts a third parameter, which is a configuration object. It has a property called `stopPropagation`,
which does exactly what you think it does.

So in our contrived voting booth example, if we suppose that `Booth` is itself nested in other components that 
respond to `['onClick']` but have no logical need to update their state whenever `Button`'s ... button gets clicked,
we can adjust `Booth`'s `toC` like this:

```js
}, ['onClick'], { stopPropagation: true })
```

This nicely brings us to the next important thing we want to know about...

## Le default event list

`toC`'s default event list is `['onClick']`. All those `['onClick']` typed above? Superfluous.

To instruct `toC` to blissfully avoid reacting on any event, we pass `[]`.

## Async / Promises

`toC`'s return function (the thing that gets rendered) can also be a promise. Let's see some examples.

### It's pretty straightforward

```js
const SearchResults = toC(() => {
  let data
  
  return async ({ keyword, onCompleted }) => {
    data = await fetchResults(keyword)
    onCompleted()
    
    return data.map(/* ... */)
  }
})
```

Or with promises:

```js
const SearchResults = toC(() => { 
  return ({ keyword, onCompleted }) => {   
    return fetchResults(keyword)
      .then(data => data.map(/* ... */))
      .then(onCompleted)
  }
})
```

## Code splitting

*(In case you'd like a refresher: https://reactjs.org/docs/code-splitting.html#import)*

### This is perfectly valid

```js
// foo.js
export default function Foo() {
  return <div>Foo!</div>
}
```

```js
// bar.js
const Bar = toC(() => {
  return async () => {
    const Foo = (await import('./foo.js')).default

    return <Foo />
  }
})
```

As an aside, that `.default` after `await` is there because we're not using named exports in this example.

Let's pause for a few moments and let the beautiful simplicity of this, gently sink in.

#### What about an error message on failure to import?

```js
const Bar = toC(() => {
  return async () => {
    try {
      const Foo = (await import('./foo.js')).default

      return <Foo />
    } catch (e) {
      return <div>Failed to load.</div>
    }
  }
})
```

#### What about a message while it awaits?

With just what we've seen so far, this could be problematic if we go with `await`, because how are we going to trigger a rerender. We'll view the solution later on but let's verify the issue now:

```js
const Bar = toC(() => {
  let Foo
  
  return async () => {
    if (!Foo) {
      return <div>Loading...</div>
    } 
    
    // Execution will never reach here
    
    try {
      Foo = (await import('./foo.js')).default

      return <Foo />
    } catch (e) {
      return <div>Failed to load.</div>
    }
  }
})
```

We can do code-splitting without using `await` and instead do the same pattern as the very first example.
This doesn't utilize `toC`'s ability to return a promise though.

```js
const Bar = toC(() => {
  let Foo
  let error

  return () => {
    if (error) {
      return <div>Whooops, I did it again.</div>
    }

    if (!Foo) {
      import('./foo.js')
        .then(obj => {
          Foo = obj.default
        })        
        .catch(e => {
          error = e
        })
        .finally(tick)

      return <div>Loading</div>
    }

    return <Foo />
  }
})
```

#### We can do it in a cleaner way

```js
const Bar = toC(({ tick }) => {
  let Foo
  let error

  import('./foo.js')
    .then(obj => {
      Foo = obj.default
    })
    .catch(e => {
      error = e
    })
    .finally(tick)

  return () => {
    if (error) {
      return <div>Whooops, I did it again.</div>
    }

    if (!Foo) {
      return <div>Loading</div>
    }

    return <Foo />
  }
})
```

That import statement is on the component part that only runs once. This way, the render part of the component
stays clean and straightforward.

### Naturally, we can do much better!

**C'mon Godfather, I want to do this inside the render function!**

I knew you'd ask, so here we go:

```javascript
const Unyielding = toC(({ withTick }) => {
  let Foo
  
  // Notice that extra `function *` there
  return async function * () {
    try {
      import('./foo.js')
              .then(C => { Foo = C.default })
              .then(() => delay(1000))
              .then(tick)
    } catch (e) {
      return <div>Oh dear...</div>
    }

    yield <div>Fetching...</div>

    return <Foo/>
  }
}, [])
```

You don't have to be Italian to enjoy good pizza. 
And now you don't have to know about generators to `yield` JSX.

*(Play with these variations [here](https://codesandbox.io/s/react-godfather-docs-demo-4-06pc0))*

### Any alternative style for `.then(tick)`?

Of course! Enter `withTick`. This is a wrapper function that does that `.then(tick)` for you.

Consider the following example:

```javascript
const Example = toC(({ withTick }) => {
  let data = null

  // Function wrapped `withTick`
  const getMyData = withTick(async () => {
    await delay(1200)

    data = '"But, for my own part, it was Greek to me."'
  })

  return function * () {
    getMyData() // Will `tick` on its own after it completes

    yield <div>Fetching...</div>

    getMyData() // Will `tick` on its own after it completes

    yield <div>Fetching some more...</div>

    return (
      <div>{data}</div>
    )
  }
}, [])
```

By wrapping your functions `withTick`, the code inside the render function becomes a bit cleaner.

## Async generators

The render function of a `react-godfather` functional component can be:
* A function
* An async function (i.e. a function that returns a promise)
* A generator function (i.e. a function that returns a Generator object)
* An async generator (i.e. a function that promises to return a Generator object)

Generator functions (and their async variants) are a really powerful Javascript feature, since its debut back in 2015. 
Their only problem is that they are kinda low-level with an awkward syntax. This made them get pushed in the collective 
background and eventually paved the way for async/await in 2017.

So why do we care? Well, generator functions can be "paused" and "resumed" 
(like in a debugger but without stopping the whole app - just the function execution itself). 

This allows us to do interesting things, avoiding some boilerplate code. And since that's the case, `react-godfather`
supports them seamlessly. Just have the component return `function * {}` instead of `() => {}` 
(and `async function * () {}` instead of `async () => {}`). Then you can simply `yield` to your heart's content.

Need a refresher on the concept of Generators? I suggest [this](https://javascript.info/generators-iterators) resource.

*(play with some `yield`s [here](https://codesandbox.io/s/react-godfather-docs-demo-4-06pc0))*

## Cleanup function

Sometimes, we need to do some cleanup on unmount because of side effects we've introduced (maybe we've instantiated a 
library outside the React tree or perhaps we need to unsubscribe from an event).
For this, we want the equivalent of `componentWillUnmount` or Hooks' `useEffect(() => cleanup, [])`.

The structure of react-godfather is such that the component the developer actually writes is a child component to the
inner "engine" component. 
But the cleanup function needs to be defined in the dev-written component. Therefore, we need to pass a function from 
the child (the dev-written component) to the parent (the "engine" that drives the react-godfather component).

For this, we introduce another `props` parameter, `onUnmount`. This is a function that we need to call from our 
react-godfather component. Godfather will remember to call upon it (*"and that day may never come"*) when 
React decides to kill our component.

Consider this example:

```javascript
const WithCleanup = toC(({ onUnmount }) => {
  const topic = 'foo'
  let subscribed = false

  const handleClick = () => {
    MockAPI.subscribe(topic)
    subscribed = true
  }

  // Will execute when React unmounts the component
  // The provided function has access to the component's state
  onUnmount(() => {
    if (subscribed) {
      MockAPI.unsubscribe(topic)
    }
  })

  return () => {
    return (
      <div>
        <button onClick={handleClick}>
          Subscribe
        </button>
      </div>
    )
  }
})
```

`onUnmount` is passed in the component as a prop. It is a function that takes as a parameter the function we want to
have executed for cleanup. We provide it with a closure and Godfather will make sure to execute it when the component
is to be unmounted by React. The closure naturally has access to the component's state.

This example is on the StoryBook. To test it open the web inspector, select the story, press subscribe and then
pick a different story.

## How does this magic work?

TL;DR: Generators + Event bubbling.

A detailed explanation of how react-godfather works is coming up soon in a blog post.

I will update the docs with a link here once it's up. `Watch` the repo to get notified or send me a hi at 
`react-godfather@kapolos.com` and I'll email you the link once it's up.

## Code Examples

### StoryBook

This repo contains a number of examples in the format of StoryBook. 
To access, clone the repo, `npm install` and `npm start`.

The StoryBook in this repo currently contains the following:

* Demo
  * Todo List App, with filtering and refetch
* Examples
  * Multiplication buttons
  * Voting Booth  
  * Form Input  
  * Props  
  * Code-splitting  
  * Cleanup
* Gotchas    
  * Initial Props
* Async generators    
  * Yield, `withTick`
  * Async, Yield, `withTick`
* Helpers    
  * Wait

### CodeSandbox

For ease of access & play, some examples are also provided in CodeSandbox.

These are the currently available ones:

* [Todo List App](https://codesandbox.io/s/react-godfather-todo-app-ro8e3)
* Documentation examples
  * [Example 1](https://codesandbox.io/s/react-godfather-docs-demo-1-dco9i)
  * [Example 2a](https://codesandbox.io/s/react-godfather-docs-demo-2a-f7947)
  * [Example 2b](https://codesandbox.io/s/react-godfather-docs-demo-2b-lzgs0)
  * [Example 3](https://codesandbox.io/s/react-godfather-docs-demo-3-ggefk)
  * [Example 4](https://codesandbox.io/s/react-godfather-docs-demo-4-06pc0)

## Usage & understanding the configuration

### Install

`yarn add react-godfather`

### Usage

`import { toC/*, Wait*/ } from 'react-godfather`

### Understanding

#### `toC`

To use `react-godfather`, you wrap your component with `toC`:

```javascript
const Foo = toC(() => {
  return () => (<div>Hi!</div>)
})
```

`toC` is a function with the following parameters:
`(f, events = ['onClick'], opts)`

| name | description |
| f | your functional component |
| events | the list events you want it to automatically react upon - defaults to `onClick`|
| opts | a configuration object : `{ id :: String, stopPropagation :: Bool }` |

#### What props does your component receive?

Straight from the source's ... mouth: 

```javascript
  const componentProps = {
    ...props,
    prevProps,
    __dbg: dbg,
    tick,
    withTick: x => () => x().then(tick),
    onUnmount: onUnmountReceiver
  }
```

* `props` are exactly what you expect - the props passed to your component by your own code
* `tick` is the function you call to explicitly trigger an update.
* `withTick` is a wrapper function to reduce the usefulness of `tick` :)
* `onUnmount` lets you provide a function to be run in the context of your component on unmount.

#### `Wait`

`Wait` is a simple, straightforward helper component:

```javascript
  return (
    <Wait
      until={() => data}
      launch={() => getMyData().then(props.tick)}
      lounge={(<div>Loading......</div>)}
    >
      <div><button onClick={handleClick}>{data}</button></div>
    </Wait>
  )
```

## FAQ

### But why?

First let me state clearly that Hooks are technically awesome. Godfather is itself a functional component with Hooks. 
And while conceptualizing and building `react-godfather`, I came to understand and appreciate some design decisions
that the React team had to make - facing similar questions made me realize some of the clever answers they came up with.

React-godfather came out as my answer to not-so-technical but human concerns.

Hooks are great once you've really "gotten" them. It's a different way of reasoning than the "normal" way
of writing JavaScript. Therefore, it raises the bar for junior colleagues. You've probably seen the struggle if
you've been involved in teams that have a mix of seniors and juniors. Some will get it faster than others and - in some
cases - some won't truly get it at all (don't forget that not every colleague happens to have a CS background).

One could argue that we shouldn't disregard sophistication for practicality. And mostly, I agree. But are you using
PureScript in production? Because if we're talking about really valuing sophistication in the JavaScript ecosystem, 
is there any excuse not to go 100% in 
instead of just [pretending really hard](https://www.youtube.com/watch?v=IvPBMEYxP-Y)?

It is clear that we already make a huge concessions, because reality imposes constraints to our ideal development 
practices. In that sense, I do think that it is worth making it easier for new entrants to write modern (classes are out) 
React code without (excuse the pun) `useHairPulling`.

Another reason is stylistic and more of a preference. I - for one - simply enjoy better the top-down style of 
reasoning about code. 
Maybe because I started with QBasic :) So this does scratch that itch.

### What about speed? Isn't checking for deep equality slow?

`react-godfather`'s only dependency is [dequal](https://github.com/lukeed/dequal). `dequal` boasts ~ 1.7 million ops per second for Object comparisons,
which I guess is enough for almost every app out there that isn't aiming for 60 fps. 
Plus, remember that `react-godfather` plays well with everything, so you can just skip using it for that pesky 
component that really has to squeeze out all those nanoseconds of performance.

### Is it still really a functional component?

From React's perspective, the output of `toC` is a functional component.

Certainly bringing in data via `useState()` is phenomenologically "looking the part" more. Under the hood 
you still have code that takes your component, does some computations and replaces your variables with their
proper values, based on externally kept state.

React-godfather does the same but with a different implementation. The state still lives outside your component.
It is the Godfather function (which itself is a standard React functional component) that keeps track of 
your component's state, using the magic of Async Generators. And when React wants to render you component,
Godfather will make sure to pass your "stateless" code over to React, filled in with the proper values.

In other words, your components don't actually keep state, it only **feels** like they do. 
Which is the point of this whole exercise :innocent:
Which is the point of this whole exercise :innocent:

## License

MIT
