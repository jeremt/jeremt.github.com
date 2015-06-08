In this article, I'll show you a C++ implementation of properties that I designed for a game
engine project I'm currently working on. Properties had to be non-templated objects, so we can
store them into a unordered_map for example. However, they need to be able to store values of
different types. Finally, I wanted to be able to implement the 3 following methods the way I wanted:

- Constructor
- Setter
- Getter

To make easier to understand why I wanted that, I'll give you some examples of properties
that I wanted to handle:

| Type	            | Constructor	                                                      | Setter	                                                  | Getter                                                       |
| ----------------- | ------------------------------------------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------|
| Vec3	            | Create from a value.	                                              | Set from a value.	                                      | Get from a value.                                            |
| Choice	        | Give the possible values for the properties as an initializer_list. |	Set the choice to the given input if it's a valid option. | Return the currently selected choice.                        |
| KeyframeSequence	| Give the list of keyframes as an initializer_list.          	      | Add some keyframes as an initializer_list.                | Return the current value (the current position for example). |


The following code show you how I will use the class in c++:

```
std::unordered_map<std::string, Property> my_properties;
my_properties["position"] = new Vec3(0, 0, 1);
my_properties["shape"] = new Choice({"rectangle", "circle", "triangle"});
my_properties["anim"] = new KeyframeSequence<Vec3>({
  Keyframe<Vec3>(Vec3(0, 0, 0), Vec3(0.5f, 0, 0), 0.0f, 0.5f, "cubic_out"),
  Keyframe<Vec3>(Vec3(0.5f, 0, 0), Vec3(0.5f, 0.5f, 0), 0.5f, 1.0f, "bounce_out")
});

my_properties["position"].value<Vec3>().x += 2;
my_properties["shape"].value<Choice>("circle");
std::cout << my_properties["anim"].value<KeyframeSequence<Vec3>>() << std::endl;
```