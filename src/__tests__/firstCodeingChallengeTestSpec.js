const Solution = require('../solution');


describe('Array Object Operations', () => {
    let solution;
    let originalObj;

    beforeEach(() => {
      solution = new Solution();
      originalObj = {
        a: {
          b: [
            { _id: '5dc0ad700000000000000000', name: 'asdf1' },
            { _id: '5dc0ad700000000000000001', name: 'asdf2' },
            { _id: '5dc0ad700000000000000002', name: 'asdf3' }
          ]
        },
        value: 'hui'
      };
    });
  
    it('apply update / change array object', () => {
      let update = {"a.b[5dc0ad700000000000000000]": { "title": "asdf1-updated" }};
      solution.applyUpdate(originalObj, update);
      expect(originalObj.a.b[0]._id).toEqual("5dc0ad700000000000000000");
      expect(originalObj.a.b[0]["title"]).toEqual("asdf1-updated");

    });

    it('apply update / change array value', () => {
      let update = {"a.b[5dc0ad700000000000000000].titleValue": "asdf1-updated"};
      solution.applyUpdate(originalObj, update);
      expect(originalObj.a.b[0].titleValue).toEqual("asdf1-updated");
    });

    it('add an array entry', () => {
      let update = {"a.b[]": { "_id": "5dc0ad700000000000000003", "name": "co2" }};
      solution.applyUpdate(originalObj, update);
      expect(originalObj.a.b[3].name).toEqual("co2");
    });
    it('remove array entry', () => {
      let update = {"a.b[5dc0ad700000000000000001]": null};
      solution.applyUpdate(originalObj, update);
      expect(originalObj.a.b.length).toEqual(2);
    });

    it('add regular object value', () => {
      let update = {"a.c": "hallo"};
      solution.applyUpdate(originalObj, update);  
      expect(solution.getValueAtPath(originalObj,"a.c")).toEqual("hallo");
    });

    it('update regular object value', () => {
      let update = {"a.c": "hallo-changed"};
      originalObj = {
        "a": {
          "b": [
            { "_id": "5dc0ad700000000000000000", "name": "asdf1" },
            { "_id": "5dc0ad700000000000000001", "name": "asdf2" },
            { "_id": "5dc0ad700000000000000002", "name": "asdf3" }
          ],
          "c": "hallo" 
        },
        "value": "hui"
      }; 
      
      solution.applyUpdate(originalObj, update);  
      expect(solution.getValueAtPath(originalObj,"a.c")).toEqual("hallo-changed");
    });

    it('unset regular object value on root level', () => {
      let update = {"value": null};
      solution.applyUpdate(originalObj, update);  
      expect(originalObj["a"]["value"]).toEqual(undefined);
    });

    it('unset regular object value NOT on root level', () => {
      let update = {"a.b": null};
      solution.applyUpdate(originalObj, update);  
      expect(originalObj["a"]["b"]).toEqual(undefined);
    });

    it('multiple operations at one time', () => {
      let update = {"value": null,"something": "anything","a.c": "hallo"};
      solution.applyUpdate(originalObj, update);  
      expect(solution.getValueAtPath(originalObj,"a.c")).toEqual("hallo");
      expect(originalObj["something"]).toEqual("anything");
      expect(originalObj["a"]["value"]).toEqual(undefined);

    });

    it('apply array update and create underyling array or object', () => {
      let update = {
        "x[]": "asdfX",
        "v.x[]": "asdfV",
        "v.m.l": "asdf-val"
      };

      const expectedObject = {
        "a": {
          "b": [
            { "_id": "5dc0ad700000000000000000", "name": "asdf1" },
            { "_id": "5dc0ad700000000000000001", "name": "asdf2" },
            { "_id": "5dc0ad700000000000000002", "name": "asdf3" }
          ]
        },
        "x": ["asdfX"], 
        "v": {
          "x": ["asdfV"], 
          "m": {
            "l": "asdf-val"
          }
        },
        "value": "hui"
      }
      solution.applyUpdate(originalObj, update);  
      expect(originalObj).toEqual(expectedObject);

    });

    it('apply user image update', () => {
       originalobj = {
        a: {
          b: [
            { _id: '5dc0ad700000000000000000', name: 'asdf1' },
            { _id: '5dc0ad700000000000000001', name: 'asdf2' },
            { _id: '5dc0ad700000000000000002', name: 'asdf3' }
          ]
        },
        value: 'hui',
        images: {
          thumbnail: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
          small: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
          medium: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
          large: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg',
          xlarge: 'http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573477587288.jpg'
        }
      };

      let update = {
        "images": {
          "thumbnail": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "small": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "medium": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "large": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "xlarge": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg"
        }
      };

      solution.applyUpdate(originalObj, update);

      expect(originalObj).toEqual({
        a: {
          b: [
            { _id: '5dc0ad700000000000000000', name: 'asdf1' },
            { _id: '5dc0ad700000000000000001', name: 'asdf2' },
            { _id: '5dc0ad700000000000000002', name: 'asdf3' }
          ]
        },
        value: 'hui',
        images: {
          "thumbnail": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "small": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "medium": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "large": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg",
          "xlarge": "http://files-test.hokify.com/user/pic_5b30ac932c6ba6190bfd7eef_1573480304827.jpg"
        }
      })
    });
  });
