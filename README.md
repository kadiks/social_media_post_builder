# Social media post builder

## TODO

- [x] Remove the image background (for 3D FB photo) on the server side by sending the JSON with object ID, so I know which one to remove from the JSON. So then I can make one response with 2 images instead of sending 2 requests and changing image on the front end
- [x] filter quotes based on selected items and display numbers
- [x] make the text and author moves locked together (while there are 2 separates layers: needed for styling and 3D differentation)
- [ ] search quotes by index number
- [ ] export pure function to other files (fabric-utils, html-display, gsheets-utils)
- [x] a function to recalculate SVG size to stay inside a NxN (N=100) square pixels
- [ ] gsheets-utils to load and update gsheets data
- [ ] Have a colored background option instead of an image
- [ ] Have an option to add a layer on top of image to increase readability of text
- [x] Change color text
- [ ] Change color shadow
- [ ] ~~Add stroke around text~~
- [ ] Have an option to center vertically or horizontally any object
- [ ] Option to create GIF (check before if it works on FB, otherwise, create a video)
- [ ] Options to have templates (check the Pinterest "well designed social media posts" wall and others for ideas)
- [x] Add a "select" button to load image from the carousel only after I hit select (this slow down the app especially when I look at a lot of pictures)
- [x] When using the button select, add those images to a list of "saved" image that I can review and reuse OR (easier) add a link to open the image on Unsplash and I save it to the Kyeda collection
- [x] Once the export has been done, send the link of the export to be displayed on the page. So I choose when to leave the "making page"
- [x] Make the text stay inside the box width and wrap
- [ ] Change #drawScene for #render so we can use the sharedSettings for any changes
  - [ ] fix scale image issue
  - [ ] fix image display delay
- [ ] Upload image from computer
- [ ] Make video slideshow like [this one](https://www.facebook.com/forbes/videos/2210815839210391/?__xts__%5B0%5D=68.ARDZGhFdLZ5nPEECKDldx1FBX6eJ8X_oMyN0ny0nhpWJk1a0ipw2KzWTPsV9AUTNSxcXzBNlcC3VCSi2J8tW90Rhqw9DQ855wf-9gbHgAMnsVV3r7LcXHHAS473AjBRi0dP_pA5wZ9j1Y0k4z9-46_FvkCmnbXrzWZdKaA9m_4negMHXEmnLhS2iVwEJkk7XPukSdzT2OhM6wnTOhPNkVjHGc9dyIOwBjhvyBYFiyJzo5odXZWyBluErXHSYNbeiXpIPLS7D-IHT1qZR9CXC5oNY5QtRK51h8c008V00y1ejtsqvVveBO_vKwas70VczStEiL91oi90mI5rgEjkjYplzy45NC6s90_--k1IxHmxSQIr13glknXQQNF4&__tn__=-R)
