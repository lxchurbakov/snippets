## Notes

Please mind that you probably want to wrap each plugin's Extensions' content into separate component, because, if you don't do otherwise, each update of state inside a plugin will trigger all of the extensions to rerender. For React they all are within the same component - <App />.

If you want to share state, you can either return it from the hook, if it's defined in a hook, or, and it's better to do so, export it wrapped with useBetween from your plugins file so other components can reuse that.