There is a UI framework I've added that supports a wide range of UI primitives that are all laid out through a declarative syntax.  The syntax allows for integration w/ game media and config and layout of the UI elements.  Simple transformations on UI elements are allowed and managed through a rect transform implementation.  UI elements can be nested such that parent scaling and translations apply to any children.  Autofit has also been implementing, including support for border specifications (so that UI elements can be autofit to a parent or configured to fill a certain percent of the parent's space).

Because the UI is defined through a data-driven declarative syntax, templates can be created for easy re-use of common elements (like buttons or panels), so that they all have the same look and feel, but can be rapidly changed across the project.

All UI elements act as a "View" which needs to be managed and controlled by game-specific logic (the "Controller").  Besides defining the layout of the UI elements, UI writers will need to write the UI controller logic as well.  The controller logic will link game state (model) to the view.  UI events are the primary mechanism used to tie player actions to game logic.  Buttons and other UI elements can be associated with callback functions that are executed when the player clicks that button.

The following UI primitives are currently supported by the engine:

- **UxCanvas** - representation of the base canvas.  Used as the parent for most UI implementations.
- **UxPanel** - a simple panel implementation which can display a background color or image.
- **UxButton** - a button implementation supporting different button states and both text/bg images.
- **UxInputPanel** - a text input implementation.
- **UxText** - a non-editable text implementation.

Underneath many of these UI elements is the concept of a **Sketch**.  A sketch is a generic class that represents an element that can be rendered.  There are a number of subclasses under a Sketch that implement the same API and therefore can be used interchangeably within the UI elements.  For example, there is a Sprite subclass that works wraps a JS Image.  There is also an Animation subclass that wraps a series of JS Images that when rendered will run through the series to display an animation.  Wherever a sketch can be used in any of the UI elements, any of the Sketch subclasses can be used.

The available Sketch subclasses are:

- **Sprite** - a single Image
- **Rect** - a colored rectangle (with or without a border) using JS rect primatives.
- **Animation** - a series of Images that run in sequence to create a single animation.
- **Animator** - a set of animations that are tied to state logic (model state is passed through to the render cycle to drive changes in animator state).
- **Shape** - a primitive shape renderer using a set of vectors and lines.
- **StretchSprite** - a 9-sliced sprite Image that when fit to a parent will scale the slices appropriately based on a border setting.
- **Text** - primitive text rendering which supports an autofit option

I'm happy to walkthrough the setup and use of the UI framework and help out anyone that wants to use it to work out UI screens.  There are some missing UI primitives (radio buttons, scrolling regions and scrollbars) that we could discuss implementing if you think of a use case for the game that needs them.

