Asset management is broken up into two separate sets of definitions and loading processes.

Media management is means to define and load all media types for the game, including images, audio, songs, animations, etc.

Asset management is used to define the game model/object definitions that will be used to build the game.  Asset management will tie back to media definitions when things like sprites, animations, or audio need to tied to game state, but will also specify further game model details not specifically associated with the media.

Templates are used to handle repeated patterns in both media and asset management.  For example, tile assets can be organized into a fixed pattern and a common template can be used for defining all of the media and assets associated with the tileset.

New templates can be created as needed.

In general spritesheets should be used over individual image files.  Media management is responsible for breaking the spritesheets up into individual sprites for use within assets.
