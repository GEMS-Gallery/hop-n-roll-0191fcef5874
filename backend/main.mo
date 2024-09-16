import Nat "mo:base/Nat";
import Text "mo:base/Text";

import Array "mo:base/Array";
import Debug "mo:base/Debug";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Order "mo:base/Order";

actor {
  // Stable variable to store high scores across upgrades
  stable var highScores : [(Text, Nat)] = [];

  // Add a new high score
  public func addHighScore(name : Text, score : Nat) : async () {
    highScores := Array.sort(
      Array.append(highScores, [(name, score)]),
      func (a : (Text, Nat), b : (Text, Nat)) : Order.Order {
        Int.compare(b.1, a.1) // Sort in descending order
      }
    );

    // Keep only top 10 scores
    if (highScores.size() > 10) {
      highScores := Array.subArray(highScores, 0, 10);
    };
  };

  // Get all high scores
  public query func getHighScores() : async [(Text, Nat)] {
    highScores
  };

  // System functions for upgrades
  system func preupgrade() {
    // highScores is already a stable variable, so no action needed
  };

  system func postupgrade() {
    // highScores will be automatically restored, so no action needed
  };
}
