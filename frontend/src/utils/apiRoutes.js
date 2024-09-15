const DC_IMAGE_BASE_URL = "https://cdn.discordapp.com";

class apiRoutes {
  user = "api/user";
  auth = "api/oauth";
  avatarImage(userId, avatarHash) {
    // temp
    return "https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=0.752xw:1.00xh;0.175xw,0&resize=1200:*";
    // return `${DC_IMAGE_BASE_URL}/avatars/${userId}/${avatarHash}.png`;
  }
}

export default new apiRoutes();
