import { Component, ReactNode } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { styles } from "./ErrorBoundary.styles";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: string;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, errorInfo: "" };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    this.setState({ errorInfo: info.componentStack ?? "" });
  }

  resetError = () => this.setState({ hasError: false, error: null, errorInfo: "" });

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <View style={styles.container}>
        <Text style={styles.title}>L'app a crashé</Text>
        <Text style={styles.label}>Erreur :</Text>
        <ScrollView style={styles.scroll}>
          <Text selectable style={styles.code}>
            {this.state.error?.toString()}
          </Text>
          {this.state.errorInfo ? (
            <>
              <Text style={styles.label}>Stack composants :</Text>
              <Text selectable style={styles.code}>
                {this.state.errorInfo}
              </Text>
            </>
          ) : null}
        </ScrollView>
        <Pressable style={styles.btn} onPress={this.resetError}>
          <Text style={styles.btnText}>Réessayer</Text>
        </Pressable>
      </View>
    );
  }
}
