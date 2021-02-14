import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:path_provider/path_provider.dart';
import 'package:http/http.dart' as http;

List<CameraDescription> cameras;

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  cameras = await availableCameras();
  runApp(CameraApp());
}

class CameraApp extends StatefulWidget {
  @override
  _CameraAppState createState() => _CameraAppState();
}

class _CameraAppState extends State<CameraApp> {
  CameraController controller;

  @override
  void initState() {
    super.initState();
    controller = CameraController(cameras[0], ResolutionPreset.medium);
    controller.initialize().then((_) {
      if (!mounted) {
        return;
      }
      setState(() {});
    });
  }

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }

  startTakingImage() async {
    controller.takePicture().then((value) async {
      final StorageReference firebaseStorageRef = FirebaseStorage.instance
          .ref()
          .child('SS' + DateTime.now().toString());
      String tempPath = (await getTemporaryDirectory()).path;
      File file = File('$tempPath/profile.png');
      var bytesFile = await value.readAsBytes();
      await file.writeAsBytes(bytesFile);
      final StorageUploadTask task = firebaseStorageRef.putFile(file);
      String url = await (await task.onComplete).ref.getDownloadURL();
      file.delete(recursive: true);
      print(url);
      var headers = {
        'x-auth-token':
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjAyNjMxZGYyZWM5MzNiMWI4YmZmZjBhIn0sImlhdCI6MTYxMzIyOTQwMCwiZXhwIjoxNjEzNTg5NDAwfQ.93s1brYh3W8S-9o9Qnhu4fT_Wk_oZjfbahLmQaDk9BM',
        'Content-Type': 'application/json'
      };

      var resp = await http.post(
        'https://spit-hack.herokuapp.com/api/analytics/createAnalytics',
        headers: headers,
        body: jsonEncode({"video": url}),
      );

      if (resp.statusCode == 200) {
        print(resp.body);
      }
    });
    Future.delayed(Duration(seconds: 10)).then((_) {
      startTakingImage();
    });
  }

  @override
  Widget build(BuildContext context) {
    if (!controller.value.isInitialized) {
      return CircularProgressIndicator();
    } else {
      return MaterialApp(
        home: Scaffold(
          body: Container(
            color: Colors.yellow,
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                RaisedButton(
                  onPressed: () {
                    startTakingImage();
                  },
                  child: Text('Take ss'),
                ),
                Container(
                  margin: EdgeInsets.all(20),
                  padding: EdgeInsets.all(20),
                  decoration: BoxDecoration(
                      border: Border.all(color: Colors.pink, width: 2)),
                  child: AspectRatio(
                    aspectRatio: controller.value.aspectRatio,
                    child: CameraPreview(controller),
                  ),
                ),
              ],
            ),
          ),
        ),
      );
    }
  }
}
