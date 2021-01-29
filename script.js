let vehicles;

function create() {

  vehicles = this.add.group();

  this.time.addEvent({
    callback: spawnVehicle,
    delay: 2000, // 2 seconds
    loop: true
  });
}

function preload() {

  this.load.image('car-1', 'assets/car-1.gif');
  this.load.image('car-2', 'assets/car-2.gif');
  this.load.image('car-3', 'assets/car-3.gif');
}

/**
 * Spawns a vehicle in a random lane.
 */
function spawnVehicle() {

  const lane = Phaser.Math.RND.between(0, 11);

  const x = 32 * lane + 80;
  const y = -32;

  const key = Phaser.Math.RND.pick(['car-1', 'car-2', 'car-3']);

  const vehicle = vehicles.get(x, y, key);

  if (!vehicle) {
    return;
  }

  vehicle
    .setActive(true)
    .setVisible(true);
}

function update() {

  Phaser.Actions.IncY(vehicles.getChildren(), 2);

  vehicles.children.iterate((vehicle) => {
    // Is the vehicle off the bottom of the screen?
    if (vehicle.y > 640) {
      vehicles.killAndHide(vehicle);
    }
  });
}

const config = {
  height: 640,
  scene: { preload, create, update },
  width: 480
};

const game = new Phaser.Game(config);
