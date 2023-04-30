class Joint {

    // in urdf a joint is defined as follow
    // <joint name="arm joint" type="revolute">
    //      <parent link="name of parent link"/>
    //      <child link ="name of child link" />
    //      <origin xyz="0.25 0 1" rpy="0 0 0"/> position and orientation before any motion
    //      <axis  xyz="0 -1 0" /> direction along which the robot moves
    //      <limit lower="0" upper="pi/2" velocity="100" effort="100"> max and min values of limits
    // </joint>
}